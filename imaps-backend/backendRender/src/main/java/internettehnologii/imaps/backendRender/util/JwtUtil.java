package internettehnologii.imaps.backendRender.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {

    private final String secret = "toskamuecickonadzako";

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 sati
                .signWith(SignatureAlgorithm.HS256,secret)
                .compact();
    }
    public String extractUsername(String token){
        //todo

        return "";
    }


}
