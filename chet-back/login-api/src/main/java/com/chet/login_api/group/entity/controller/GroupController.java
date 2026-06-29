package com.chet.login_api.group.controller;

import com.chet.login_api.conversation.dto.ConversationListItemDTO;
import com.chet.login_api.group.dto.CreateGroupDTO;
import com.chet.login_api.group.dto.UpdateGroupDTO;
import com.chet.login_api.group.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<ConversationListItemDTO> createGroup(@RequestBody CreateGroupDTO request) {
        try {
            ConversationListItemDTO newGroup = groupService.createGroup(request);
            return ResponseEntity.ok(newGroup);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{groupId}/rename")
    public ResponseEntity<ConversationListItemDTO> renameGroup(
            @PathVariable UUID groupId,
            @RequestBody Map<String, String> body) {
        try {
            String newName = body.get("name");
            if (newName == null || newName.isBlank()) return ResponseEntity.badRequest().build();
            ConversationListItemDTO updated = groupService.renameGroup(groupId, newName);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{groupId}/participants")
    public ResponseEntity<Void> addParticipant(
            @PathVariable UUID groupId,
            @RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            if (userId == null || userId.isBlank()) return ResponseEntity.badRequest().build();
            groupService.addParticipant(groupId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID groupId) {
        try {
            groupService.deleteGroup(groupId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}