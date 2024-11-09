
function useMapViewHook() {
  const { mapName } = useParams();
  const { username } = useContext(AuthContext);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [app, setApp] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [floors, setFloors] = useState([]);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  return {
    mapName,
    username,
    mapLoaded
  }
}

export default useMapViewHook;