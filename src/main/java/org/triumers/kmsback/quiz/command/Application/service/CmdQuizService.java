package org.triumers.kmsback.quiz.command.Application.service;

import org.triumers.kmsback.quiz.command.Application.dto.CmdQuizDTO;
import org.triumers.kmsback.quiz.command.domain.aggregate.vo.CmdRequestQuizVo;

public interface CmdQuizService {
    CmdQuizDTO registQuiz(CmdRequestQuizVo request);
}
