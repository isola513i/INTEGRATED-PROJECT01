package com.example.backend.utils;

public final class MaskingUtil {
    private MaskingUtil() {}
    public static String maskKeepLast234(String input) {
        if (input == null || input.isEmpty()) return input;

        char[] chars = input.toCharArray();
        int length = chars.length;

        for (int i = 0; i < length; i++) {
            int positionFromEnd = length - 1 - i; // 0 = last
            // Keep positions 3, 2, 1 from end (678 in 0123456789)
            boolean shouldKeep = (positionFromEnd == 3 || positionFromEnd == 2 || positionFromEnd == 1);

            if (!shouldKeep && Character.isDigit(chars[i])) {
                chars[i] = 'x';
            }
        }
        return new String(chars);
    }
}
