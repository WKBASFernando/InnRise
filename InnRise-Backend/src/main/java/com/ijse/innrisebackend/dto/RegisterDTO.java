package com.ijse.innrisebackend.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
}
