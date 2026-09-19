package com.codearenaai.submission.kafka;

import com.codearenaai.submission.event.SubmissionEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SubmissionProducer {

    public static final String TOPIC = "submission-events";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public SubmissionProducer(@Autowired(required = false) KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishSubmissionEvent(SubmissionEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            if (kafkaTemplate != null) {
                kafkaTemplate.send(TOPIC, event.getSubmissionId().toString(), json)
                        .whenComplete((result, ex) -> {
                            if (ex != null) {
                                log.warn("Kafka publish async warning (broker offline): {}", ex.getMessage());
                            } else {
                                log.info("Published SubmissionEvent to topic={} for submissionId={}", TOPIC, event.getSubmissionId());
                            }
                        });
            }
        } catch (Exception e) {
            log.warn("Kafka publish failed (broker offline or non-blocking), degrading gracefully: {}", e.getMessage());
        }
    }
}
