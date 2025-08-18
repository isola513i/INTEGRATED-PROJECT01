package com.example.backend.utils;

public class PictureNameUtill {
    public static String getExt(String originalName) {
        if (originalName == null) return "";
        int dot = originalName.lastIndexOf('.');
        return (dot >= 0) ? originalName.substring(dot + 1).toLowerCase() : "";
    }

    public static String canonicalName(int saleItemId, int order1based, String ext) {
        ext = (ext == null || ext.isBlank()) ? "jpg" : ext.toLowerCase();
        return saleItemId + "." + order1based + "." + ext; // e.g. 86.4.jpg
    }
}
