package com.chet.login_api.group.controller;

import com.chet.login_api.conversation.dto.ConversationListItemDTO;
import com.chet.login_api.group.dto.CreateGroupDTO;
import com.chet.login_api.group.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // <-- ESTA É A CORREÇÃO PRINCIPAL
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<ConversationListItemDTO> createGroup(@RequestBody CreateGroupDTO request) {
        try {
            ConversationListItemDTO newGroup = groupService.createGroup(request);
            return ResponseEntity.ok(newGroup);
        } catch (Exception e) {
            e.printStackTrace(); // Ajuda a ver o erro exato no console do Java se der problema
            return ResponseEntity.badRequest().build();
        }
    }
}