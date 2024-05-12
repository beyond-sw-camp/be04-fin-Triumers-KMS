package org.triumers.kmsback.anonymousboard.command.Application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.triumers.kmsback.anonymousboard.command.Application.dto.CmdAnonymousBoardDTO;
import org.triumers.kmsback.anonymousboard.command.Application.service.CmdAnonymousBoardService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = CmdAnonymousBoardController.class, excludeAutoConfiguration = {SecurityAutoConfiguration.class})
public class CmdAnonymousBoardControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CmdAnonymousBoardService cmdAnonymousBoardService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    // 익명 게시글 작성 테스트
    @Test
    void createAnonymousBoard_shouldReturnCreatedAnonymousBoardDTO() throws Exception {
        CmdAnonymousBoardDTO anonymousBoardDTO = new CmdAnonymousBoardDTO();
        anonymousBoardDTO.setTitle("Title");
        anonymousBoardDTO.setContent("Content");

        when(cmdAnonymousBoardService.saveAnonymousBoard(any(CmdAnonymousBoardDTO.class))).thenReturn(anonymousBoardDTO);

        mockMvc.perform(post("/anonymous-board")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(anonymousBoardDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.content").value("Content"));

        verify(cmdAnonymousBoardService, times(1)).saveAnonymousBoard(any(CmdAnonymousBoardDTO.class));
    }

    // 익명 게시글 삭제 테스트
    @Test
    void deleteAnonymousBoard_shouldDeleteAnonymousBoard() throws Exception {
        int id = 1;

        mockMvc.perform(delete("/anonymous-board/{id}", id))
                .andExpect(status().isNoContent());

        verify(cmdAnonymousBoardService, times(1)).deleteAnonymousBoard(eq(id));
    }
}