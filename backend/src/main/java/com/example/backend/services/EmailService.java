package com.example.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String from;
    @Value("${host}")
    private String host;


    public void sendVerificationEmail(String email, String verificationToken) {
        String subject = "[ITMB shop] Email verification";
        String path = "/ssi4/verify-email";
        String message = "Click the button below to verify your email address.";
        sendEmail(email, verificationToken, subject, path, message);
    }

    private void sendEmail(String email, String token, String subject, String path, String message) {
        try {
            String actionUrl = UriComponentsBuilder.newInstance()
                    .scheme("http")
                    .host(host)
                    .port("5173")
                    .path(path)
                    .queryParam("token", token)
                    .toUriString();
            String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
                                                      border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                                              <h2 style="color: #333; text-align: center;">%s</h2>
                                              <p style="font-size: 14px; color: #555; text-align: center;">
                                                  %s
                                              </p>
                                              <div style="text-align: center; margin: 30px 0;">
                                                  <a href="%s"\s
                                                     style="background-color: #4CAF50; color: white; text-decoration: none;\s
                                                            padding: 12px 24px; border-radius: 6px; font-size: 16px;\s
                                                            font-weight: bold; display: inline-block;">
                                                      Verify Email
                                                  </a>
                                              </div>
                                              <p style="font-size: 12px; color: #777; text-align: center;">
                                                  Or copy and paste this link in your browser:
                                              </p>
                                              <p style="font-size: 12px; color: #0066cc; word-break: break-all; text-align: center;">
                                                  %s
                                              </p>
                                              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                                              <p style="font-size: 12px; color: #aaa; text-align: center;">
                                                  If you didn’t request this, please ignore this email.
                                              </p>
                                          </div>
                          
                    """.formatted(subject, message, actionUrl, actionUrl);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

}
