package com.example.backendoan;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableScheduling
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@RequiredArgsConstructor
public class BackendoanApplication {
	private final SocketIOServer socketIOServer;
	public static void main(String[] args) {
		SpringApplication.run(BackendoanApplication.class, args);
	}
	@PreDestroy
	public void stopSocketIOServer() {
		socketIOServer.stop();
	}
}
