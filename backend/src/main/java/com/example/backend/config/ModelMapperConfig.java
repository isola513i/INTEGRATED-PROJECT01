package com.example.backend.config;// imports omitted for brevity

import com.example.backend.dtos.SaleItemDto;
import com.example.backend.dtos.SaleItemV2Dto;
import com.example.backend.entities.SaleItem;
import com.example.backend.entities.SaleItemPicture;
import org.hibernate.collection.spi.PersistentCollection;
import org.hibernate.proxy.HibernateProxy;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mm = new ModelMapper();

        mm.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setSkipNullEnabled(true)
                .setPropertyCondition(ctx -> {
                    Object src = ctx.getSource();
                    if (src == null) return false;
                    if (src instanceof HibernateProxy proxy) {
                        return !proxy.getHibernateLazyInitializer().isUninitialized();
                    }
                    if (src instanceof PersistentCollection pc) {
                        return pc.wasInitialized();
                    }
                    return true;
                });

        // You already have these:
        mm.typeMap(SaleItem.class, SaleItemDto.GetAllSaleItemsDto.class).addMappings(m -> {
            m.map(src -> src.getBrand().getId(),   SaleItemDto.GetAllSaleItemsDto::setBrandId);
            m.map(src -> src.getBrand().getName(), SaleItemDto.GetAllSaleItemsDto::setBrandName);
        });
        mm.typeMap(SaleItem.class, SaleItemDto.GetSaleItemDto.class).addMappings(m -> {
            m.map(src -> src.getBrand().getId(),   SaleItemDto.GetSaleItemDto::setBrandId);
            m.map(src -> src.getBrand().getName(), SaleItemDto.GetSaleItemDto::setBrandName);
        });

        // Element map for images (reuse for all DTOs)
        mm.typeMap(SaleItemPicture.class,
                        SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto.class)
                .addMappings(m -> {
                    m.map(SaleItemPicture::getFileName,
                            SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto::setFileName);
                    m.map(SaleItemPicture::getPosition,
                            SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto::setImageViewOrder);
                });

        // Existing V2Response map (you already added something like this)
        mm.typeMap(SaleItem.class, SaleItemV2Dto.SaleItemV2Response.class).addMappings(m -> {
            m.map(src -> src.getBrand().getName(),
                    SaleItemV2Dto.SaleItemV2Response::setBrandName);
            m.map(SaleItem::getPictures,
                    SaleItemV2Dto.SaleItemV2Response::setSaleItemImages);
        });

        // NEW: map for SaleItemV2SellerResponse
        mm.typeMap(SaleItem.class, SaleItemV2Dto.SaleItemV2SellerResponse.class).addMappings(m -> {
            m.map(src -> src.getBrand().getName(),
                    SaleItemV2Dto.SaleItemV2SellerResponse::setBrandName);
            m.map(SaleItem::getPictures,
                    SaleItemV2Dto.SaleItemV2SellerResponse::setSaleItemImages);
            // if your seller DTO includes seller fields, map them here, e.g.:
            // m.map(src -> src.getSeller().getId(),
            //       SaleItemV2Dto.SaleItemV2SellerResponse::setSellerId);
            // m.map(src -> src.getSeller().getNickName(),
            //       SaleItemV2Dto.SaleItemV2SellerResponse::setSellerNickname);
        });

        return mm;
    }
}
