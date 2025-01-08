package internettehnologii.imaps.backendRender.web.entities;
import internettehnologii.imaps.backendRender.web.entities.RBA.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter
public class IMapsUser {
    @Id
    @SequenceGenerator(name = "users_id_seq", sequenceName = "users_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_seq")
    private int id;
    private String username;
    private String email;
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "profile_image_url")
    private String profileImageUrl;
    @Column(name = "oauth_provider")
    private String OAuthProvider;
    @Column(name = "oauth_id")
    private String oAuthId;
    @Column(name = "access_token")
    private String accessToken;
    @Column(name = "refresh_token")
    private String refreshToken;

    @ManyToMany
    @JoinTable(
            name = "favourites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "map_id")
    )
    private Set<IndoorMap> favoriteMaps;

    @ManyToMany(mappedBy = "users",cascade = CascadeType.PERSIST)
    private Set<Role> roles = new HashSet<>();

    public IMapsUser() {}

    public IMapsUser(int id, String name, String email, String password) {
        this.id = id;
        this.username = name;
        this.email = email;
        this.password = password;
    }

    public IMapsUser(String name, String email, String password) {
        this.username = name;
        this.email = email;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

}
