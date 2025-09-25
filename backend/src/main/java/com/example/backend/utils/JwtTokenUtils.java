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


}
