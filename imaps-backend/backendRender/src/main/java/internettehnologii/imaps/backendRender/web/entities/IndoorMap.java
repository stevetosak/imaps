package internettehnologii.imaps.backendRender.web.entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Column(name = "map_type")
    private String mapType;

    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "is_published")
    private Boolean isPublished;

    @ManyToOne
    @JoinColumn(name = "usr_id",referencedColumnName = "id", nullable = false)
    private IMapsUser user;

    @OneToMany(mappedBy = "indoorMap")
    private List<RoomType> roomTypes = new ArrayList<>();
    @OneToMany(mappedBy = "indoorMap")
    private List<Floor> floors = new ArrayList<>();
    @ManyToMany(mappedBy = "favoriteMaps")
    private Set<IMapsUser> favoritedBy = new HashSet<>();

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.status = MAP_STATUS.PRIVATE;
    }

    public int getFavouriteCount(){
        return this.favoritedBy.size();
    }

    @PreUpdate
    protected void onUpdate(){
        this.modifiedAt = LocalDateTime.now();
    }

}
