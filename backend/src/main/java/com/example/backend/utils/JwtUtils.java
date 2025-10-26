package com.example.backend.utils;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.text.ParseException;


@Component
public class JwtUtils {

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.access.minutes}")
    private long accessMinutes;

    @Value("${jwt.refresh.hours}")
    private long refreshHours;

    // optional: provide your own value in application.properties/yaml
    @Value("${jwt.secret}")
    private String keyId;

    /** In-memory keypair (generate-on-start). Replace with loading from keystore in production. */
    private final RSAKey rsaPrivateJWK;
    private final RSAKey rsaPublicJWK;

    public JwtUtils() {
        try {
            // 2048-bit RSA keypair with a key ID
            this.rsaPrivateJWK = new RSAKeyGenerator(2048).keyID("mshop-key").generate();
            this.rsaPublicJWK  = rsaPrivateJWK.toPublicJWK();
        } catch (JOSEException e) {
            throw new IllegalStateException("Failed to generate RSA keypair", e);
        }
    }

    /** Expose public JWK if you want to publish it at /.well-known/jwks.json */
    public String getPublicJwkJson() {
        return rsaPublicJWK.toJSONString();
    }

    public String generateAccessToken(Map<String, Object> claims) {
        long seconds = accessMinutes * 60;
        return buildAndSign(claims, seconds, "access");
    }

    public String generateRefreshToken(Map<String, Object> claims) {
        long seconds = refreshHours * 3600;
        return buildAndSign(claims, seconds, "refresh");
    }

    /** Parse & verify RS256 JWT, returning its claims. Throws on invalid token. */
    public JWTClaimsSet parseAuth(String token) {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            boolean ok = jwt.verify(new RSASSAVerifier(rsaPublicJWK));
            if (!ok) throw new JOSEException("Signature verification failed");
            return jwt.getJWTClaimsSet();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JWT", e);
        }
    }
    public JWTClaimsSet parseRefresh(String token) throws ParseException {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            boolean ok = jwt.verify(new RSASSAVerifier(rsaPublicJWK));
            if (!ok) throw new JOSEException("Signature verification failed");

            JWTClaimsSet claims = jwt.getJWTClaimsSet();

            // Verify it's a refresh token
            Object typ = claims.getClaim("typ");
            if (typ == null || !"refresh".equals(String.valueOf(typ))) {
                throw new IllegalArgumentException("Not a refresh token");
            }

            return claims;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid refresh token", e);
        }
    }

    public boolean isValidAuthToken(String token) {
        try {
            parseAuth(token);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            JWTClaimsSet c = parseAuth(token);
            Object typ = c.getClaim("typ");
            return "refresh".equals(typ);
        } catch (Exception ignored) {
            return false;
        }
    }
    public boolean isValidRefreshToken(String token) {
        try {
            JWTClaimsSet claims = parseRefresh(token);
            return !isExpired(claims);
        } catch (Exception ignored) {
            return false;
        }
    }

    public boolean isExpired(String token) {
        try {
            JWTClaimsSet claims = parseAuth(token);
            return isExpired(claims);
        } catch (Exception e) {
            return true; // If can't parse, consider expired
        }
    }
    /**
     * Check if claims set is expired
     */
    private boolean isExpired(JWTClaimsSet claims) {
        Date expirationTime = claims.getExpirationTime();
        if (expirationTime == null) return true;
        return expirationTime.before(new Date());
    }
    // -------------------- helpers --------------------

    private String buildAndSign(Map<String, Object> inputClaims, long lifetimeSeconds, String typ) {
        try {
            Instant now = Instant.now();
            Instant exp = now.plusSeconds(lifetimeSeconds);

            JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder()
                    .issuer(issuer)
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(exp))
                    .claim("typ", typ);

            // Copy custom claims (won’t override standard ones above)
            if (inputClaims != null) {
                for (Map.Entry<String, Object> e : inputClaims.entrySet()) {
                    String k = e.getKey();
                    Object v = e.getValue();
                    if (!"iss".equals(k) && !"iat".equals(k) && !"exp".equals(k)) {
                        builder.claim(k, v);
                        if ("sub".equals(k) && v instanceof String s) {
                            builder.subject(s);
                        }
                    }
                }
            }

            SignedJWT signed = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.RS256)
                            .type(JOSEObjectType.JWT)
                            .keyID(keyId != null ? keyId : rsaPrivateJWK.getKeyID())
                            .build(),
                    builder.build()
            );

            signed.sign(new RSASSASigner(rsaPrivateJWK));
            return signed.serialize();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to build/sign JWT", e);
        }
    }
    public String resolveToken(HttpServletRequest request) {
        String h = request.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) {
            return h.substring(7).trim();
        }
        return null;
    }

    /** Extract user id from a JWT string. Looks for `uid` claim, else falls back to `sub`. */
    public Integer extractUserId(String token) {
        JWTClaimsSet c = parseAuth(token);  // verifies & parses

        // 1) prefer standard 'sub'
        String sub = c.getSubject();
        if (sub != null && !sub.isBlank()) return Integer.valueOf(sub);

        // 2) fallback to your custom 'id' claim
        Object id = c.getClaim("id");
        if (id instanceof Number n) return n.intValue();
        if (id instanceof String s) return Integer.valueOf(s);

        // 3) (optional) also check 'uid' if you ever add it
        Object uid = c.getClaim("uid");
        if (uid instanceof Number n2) return n2.intValue();
        if (uid instanceof String s2) return Integer.valueOf(s2);

        throw new IllegalArgumentException("Token has no user id claim");
    }

    /** Convenience: read from request header and extract the id. Returns null if no token. */
    public Integer extractUserId(HttpServletRequest request) {
        String token = resolveToken(request);
        return (token != null) ? extractUserId(token) : null;
    }
}
