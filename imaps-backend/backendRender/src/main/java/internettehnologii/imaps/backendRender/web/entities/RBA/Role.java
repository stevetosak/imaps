package internettehnologii.imaps.backendRender.web.entities.RBA;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter @Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false,unique = true)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<IMapsUser> users = new HashSet<>();

    @ManyToMany(mappedBy = "roles")
    private Set<Permission> permissions = new HashSet<>();
}
