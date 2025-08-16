package com.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PageDto<T> {
    private List<T> content;
    private Boolean last;
    private Boolean first;
    private Integer totalPages;
    private long totalElements;
    private Integer size;
    private String sort;

    @JsonIgnore
    private Integer number;

    @JsonProperty("page")
    public Integer getPage() {
        return number;
    }

    @JsonProperty("page")
    public void setPage(int page) { this.number = page; }
}
