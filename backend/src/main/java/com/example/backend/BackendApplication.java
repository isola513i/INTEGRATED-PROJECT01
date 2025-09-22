package com.example.backend;

import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

//    @Bean
//    public ListMapper listMapper(){
//        return ListMapper.getInstance();
//    }
//    public <S, T> List<T> mapList(List<S> source, Class<T> targetClass, ModelMapper modelMapper) {
//        return source.stream().map(entity -> modelMapper.map(entity, targetClass)).toList();
//    }
//@Bean
//public ModelMapper modelMapper(){
//    return new ModelMapper();
//}
    @Bean
    public ListMapper listMapper(){
        return ListMapper.getInstance();
    }


}