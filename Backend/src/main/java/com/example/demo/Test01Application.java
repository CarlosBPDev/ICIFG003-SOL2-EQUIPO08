package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class Test01Application {

	public static void main(String[] args) {
		SpringApplication.run(Test01Application.class, args);
		log.info("========================================");
		log.info("Backend iniciado en http://localhost:6789/api");
		log.info("========================================");
	}

}
