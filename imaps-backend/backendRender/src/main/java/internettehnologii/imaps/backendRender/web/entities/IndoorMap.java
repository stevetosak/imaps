package internettehnologii.imaps.backendRender.web.entities;
import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter @Setter
@Table(name = "maps")
public class IndoorMap {
    @Id
    @SequenceGenerator(name = "maps_id_seq", sequenceName = "maps_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "maps_id_seq")
    private Integer id;

    private String name;

    @Column(name = "gmaps_url")
    private String gmapsUrl;

    @Enumerated(EnumType.STRING)
    private MAP_STATUS status;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "usr_id",referencedColumnName = "id", nullable = false)
    private IMapsUser user;

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.status = MAP_STATUS.PRIVATE;
    }
    @PreUpdate
    protected void onUpdate(){
        this.modifiedAt = LocalDateTime.now();
    }




}
