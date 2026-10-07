package com.donateconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponseDto user;
    
    @JsonProperty("requiresOtp")
    @Builder.Default
    private boolean requiresOtp = false;

    @JsonProperty("requiresOtp")
    public boolean isRequiresOtp() {
        return requiresOtp;
    }

    @JsonProperty("requiresOtp")
    public void setRequiresOtp(boolean requiresOtp) {
        this.requiresOtp = requiresOtp;
    }
}
