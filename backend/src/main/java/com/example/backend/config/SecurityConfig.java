package com.example.backend.config;

import com.example.backend.exceptions.JsonAccessDeniedHandler;
import com.example.backend.exceptions.JwtAuthenticationEntryPoint;
import com.example.backend.filters.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthFilter jwtAuthFilter,
                                                   JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                                                   JsonAccessDeniedHandler jsonAccessDeniedHandler) throws Exception {
        http
                .headers(h -> h.frameOptions(f -> f.disable()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(req -> req
                        // Allow auth/public endpoints & preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/itb-mshop/v2/auth/**").permitAll()
                        .requestMatchers("/itb-mshop/v2/cart/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/itb-mshop/v2/sale-items").permitAll()
                        .requestMatchers(HttpMethod.GET, "/itb-mshop/v2/sale-items/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/itb-mshop/v1/brands").permitAll()
                        .requestMatchers(HttpMethod.GET, "/itb-mshop/v1/storage").permitAll()
                        .requestMatchers(HttpMethod.GET,"/itb-mshop/v2/sale-items/*/images/*").permitAll()
                        .requestMatchers(HttpMethod.GET,"/itb-mshop/v2/sale-items/*/images").permitAll()
                        .requestMatchers(HttpMethod.POST, "/itb-mshop/v2/auth/logout").authenticated()

                        // SELLER-only endpoints
                        .requestMatchers(HttpMethod.GET,  "/itb-mshop/v2/sellers/*/sale-items").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.POST, "/itb-mshop/v2/saleItems").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.POST,  "/itb-mshop/v2/sellers/*/sale-items").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.PUT,  "/itb-mshop/v2/sellers/*/sale-items/*").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.DELETE,  "/itb-mshop/v2/sellers/*/sale-items/*").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.GET, "/itbms/v2/sellers/*/orders").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.GET, "/itbms/v2/sellers/*/orders/*").hasAuthority("SELLER")

                        // BUYER-only (เติมใหม่)
                        .requestMatchers(HttpMethod.POST, "/itb-mshop/v2/orders").hasAuthority("BUYER")
                        .requestMatchers(HttpMethod.GET,  "/itb-mshop/v2/users/*/orders").hasAuthority("BUYER")
                        .requestMatchers(HttpMethod.GET,  "/itbms/v2/orders/*").hasAuthority("BUYER")

                        // everything else needs authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint).accessDeniedHandler(jsonAccessDeniedHandler))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}