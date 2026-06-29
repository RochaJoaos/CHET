package com.chet.login_api.group.dto;

import java.util.List;

public class CreateGroupDTO {
    private String name;
    private List<String> userIds;

    // Getters e Setters explícitos para o Docker não reclamar
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<String> userIds) {
        this.userIds = userIds;
    }
}