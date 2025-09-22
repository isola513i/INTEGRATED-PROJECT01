package com.example.backend.entities;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Getter
public class AuthUserDetail extends org.springframework.security.core.userdetails.User {
    @Getter
    private Integer id;
    public AuthUserDetail(Integer id, String username, String password) {
        this(id, username, password,new ArrayList<GrantedAuthority>());
    }
    public AuthUserDetail(Integer id, String username, String password
            , Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }
}