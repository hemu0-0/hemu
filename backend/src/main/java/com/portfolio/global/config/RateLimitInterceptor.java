package com.portfolio.global.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int MAX_REQUESTS = 3;
    private static final long WINDOW_MS = 60_000;

    private final Map<String, List<Long>> requestTimes = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!"POST".equals(request.getMethod()) || !"/api/guestbook".equals(request.getRequestURI())) {
            return true;
        }

        String ip = getClientIp(request);
        long now = System.currentTimeMillis();

        requestTimes.putIfAbsent(ip, new ArrayList<>());
        List<Long> times = requestTimes.get(ip);

        synchronized (times) {
            times.removeIf(t -> now - t > WINDOW_MS);
            if (times.size() >= MAX_REQUESTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"요청이 너무 많습니다. 잠시 후 다시 시도해주세요.\"}");
                return false;
            }
            times.add(now);
        }
        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
