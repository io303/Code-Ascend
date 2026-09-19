package com.codearenaai.submission.kafka;

import com.codearenaai.submission.event.SubmissionEvent;
import com.codearenaai.submission.service.EvaluationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.kafka.listener.auto-startup", havingValue = "true", matchIfMissing = true)
public class EvaluationConsumer {

    private final EvaluationService evaluationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = SubmissionProducer.TOPIC, groupId = "codearena-evaluator")
    public void consumeSubmissionEvent(String message) {
        try {
            SubmissionEvent event = objectMapper.readValue(message, SubmissionEvent.class);
            log.info("Kafka consumer received SubmissionEvent for submissionId={}", event.getSubmissionId());
            evaluationService.evaluateSubmission(event.getSubmissionId());
        } catch (Exception e) {
            log.error("Failed to process submission event message from Kafka", e);
        }
    }
}
