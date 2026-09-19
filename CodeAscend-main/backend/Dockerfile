FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

COPY src/main/resources/ca.pem /app/ca.pem

RUN keytool -importcert \
    -noprompt \
    -trustcacerts \
    -alias aiven-kafka-ca \
    -file /app/ca.pem \
    -keystore $JAVA_HOME/lib/security/cacerts \
    -storepass changeit

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]