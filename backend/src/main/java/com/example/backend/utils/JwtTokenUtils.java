package com.example.backend.utils;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;

@Component
public class JwtTokenUtils {
    private static final KeyPair KEY_PAIR = Keys.keyPairFor(SignatureAlgorithm.ES256);
    private static final PrivateKey PRIVATE_KEY = KEY_PAIR.getPrivate();
    private static final PublicKey PUBLIC_KEY = KEY_PAIR.getPublic();
    //private final static SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.ES256);
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
