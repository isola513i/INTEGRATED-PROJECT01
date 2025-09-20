package com.example.backend.utils;

public final class MaskingUtil {
    private MaskingUtil() {}

    /**
     * Mask a number, keeping only the last 2nd–4th digits visible.
     * Example: 0123456789 -> xxxxx678x
     */
    public static String maskKeepLast234(String input) {
        if (input == null || input.isEmpty()) return input;

        char[] chars = input.toCharArray();
        int length = chars.length;

        for (int i = 0; i < length; i++) {
            int positionFromEnd = length - 1 - i; // 0 = last
            boolean shouldKeep = (positionFromEnd == 1 || positionFromEnd == 2 || positionFromEnd == 3);

            if (!shouldKeep && Character.isDigit(chars[i])) {
                chars[i] = 'x';
            }
        }
        return new String(chars);
    }
}
