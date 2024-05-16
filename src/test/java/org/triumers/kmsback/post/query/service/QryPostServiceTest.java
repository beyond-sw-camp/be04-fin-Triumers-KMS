package org.triumers.kmsback.post.query.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.triumers.kmsback.employee.query.dto.QryEmployeeDTO;
import org.triumers.kmsback.post.query.aggregate.entity.QryLike;
import org.triumers.kmsback.post.query.aggregate.entity.QryPostAndTag;
import org.triumers.kmsback.post.query.dto.QryLikeDTO;
import org.triumers.kmsback.post.query.dto.QryPostAndTagsDTO;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QryPostServiceTest {

    private final QryPostService qryPostService;

    @Autowired
    QryPostServiceTest(QryPostService qryPostService) {
        this.qryPostService = qryPostService;
    }

    @Test
    @DisplayName("tab 게시글 리스트 조회")
    void findPostListByTab() {

        int tabId = 1;
        List<QryPostAndTagsDTO> postList = qryPostService.findPostListByTab(tabId);

        assertFalse(postList.isEmpty());
    }

    @Test
    @DisplayName("단일 게시글 조회")
    void findPostById() {

        int postId = 16;
        QryPostAndTagsDTO post = qryPostService.findPostById(postId);

        assertThat(post.getId()).isNotNull();
    }

    @Test
    @DisplayName("게시글 히스토리 조회")
    void findHistoryListByOriginId() {

        int originId = 16;
        List<QryPostAndTagsDTO> history = qryPostService.findHistoryListByOriginId(originId);
        
        assertFalse(history.isEmpty());
    }

    @Test
    @DisplayName("게시글 좋아요 리스트 조회")
    void findLikeListByPostId() {

        int postId = 16;
        List<QryEmployeeDTO> likeList = qryPostService.findLikeListByPostId(postId);

        // EMPLOYEE SERVICE 구현 완료되면 수정
        assertThat(true);
    }



}