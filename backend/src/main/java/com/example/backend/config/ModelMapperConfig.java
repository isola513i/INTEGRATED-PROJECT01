package com.example.backend.config;

import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.SaleItem;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mm = new ModelMapper();

        mm.getConfiguration().setPropertyCondition(ctx -> {
            Object src = ctx.getSource();
            return !(src instanceof org.hibernate.collection.spi.PersistentCollection)
                    && !(src instanceof org.hibernate.proxy.HibernateProxy);
        });

        mm.typeMap(SaleItem.class, SaleItemDto.GetAllSaleItemsDto.class).addMappings(m -> {
            m.map(src -> src.getBrand().getId(),   SaleItemDto.GetAllSaleItemsDto::setBrandId);
            m.map(src -> src.getBrand().getName(), SaleItemDto.GetAllSaleItemsDto::setBrandName);
        });

        mm.typeMap(SaleItem.class, SaleItemDto.GetSaleItemDto.class).addMappings(m -> {
            m.map(src -> src.getBrand().getId(),   SaleItemDto.GetSaleItemDto::setBrandId);
            m.map(src -> src.getBrand().getName(), SaleItemDto.GetSaleItemDto::setBrandName);
        });

        return mm;
    }
}