package com.example.backend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenUtils {
    private static final KeyPair KEY_PAIR = Keys.keyPairFor(SignatureAlgorithm.ES256);
    private static final PrivateKey PRIVATE_KEY = KEY_PAIR.getPrivate();
    private static final PublicKey PUBLIC_KEY = KEY_PAIR.getPublic();
    public static String generateToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(PRIVATE_KEY,SignatureAlgorithm.ES256)
                .compact();
    }

    public boolean validateToken(String token){
        return !isTokenExpired(token);
    }
    public String extractEmail(String token){
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(PUBLIC_KEY)
                .build();
        return jwtParser.parseClaimsJws(token)
                .getBody()
                .getSubject();

    }
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    private Date extractExpiration(String token){
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(PUBLIC_KEY)
                .build();
        return jwtParser.parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    @Value("${jwt.secret}") private String hmacSecretBase64;
    @Value("${jwt.issuer}") private String issuer;
    @Value("${jwt.access.minutes}") private long accessMinutes;
    @Value("${jwt.refresh.hours}") private long refreshHours;
    private Key hmacKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(hmacSecretBase64));
    }

    public String generateAccessToken(Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessMinutes * 60);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuer(issuer)                 // iss
                .setIssuedAt(Date.from(now))       // iat
                .setExpiration(Date.from(exp))     // exp
                .claim("typ", "access")
                .signWith(hmacKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(refreshHours * 3600);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuer(issuer)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .claim("typ", "refresh")
                .signWith(hmacKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parseAuth(String token) {
        return Jwts.parserBuilder().setSigningKey(hmacKey()).build().parseClaimsJws(token);
    }

    public boolean isValidAuthToken(String token) {
        try { parseAuth(token); return true; } catch (JwtException | IllegalArgumentException e) { return false; }
    }

    public boolean isRefreshToken(String token) {
        try {
            return "refresh".equals(parseAuth(token).getBody().get("typ"));
        } catch (Exception e) { return false; }
    }
}
