package com.example.backend.utils;

import org.modelmapper.ModelMapper;

import java.util.List;

public class  ListMapper {
    private static final ListMapper listMapper = new ListMapper();

    private ListMapper() {
    }

    public <S, T> List<T> mapList(List<S> source, Class<T> targetClass, ModelMapper modelMapper) {
        return source.stream().map(entity -> modelMapper.map(entity, targetClass)).toList();
    }

    public static ListMapper getInstance() {
        return listMapper;
    }

}
