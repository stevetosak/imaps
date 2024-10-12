import React, { useState, useEffect } from 'react';
import styles from './LoadMap.module.css';
import HttpService from '../../scripts/net/HttpService';

const MapTemplateSelector = ({ loadHandler }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const httpService = new HttpService("http://localhost:8080/api/protected", true);
      try {
        const response = await httpService.get("/maps");
        setTemplates(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelect = async (template) => {
    setSelectedTemplate(template);
    console.log('Selected template:', template);
    const httpService = new HttpService("http://localhost:8080/api/protected", true);
    const response = await httpService.get(`/maps/load?mapName=${template.name}`);
    console.log("LOAD TEMPLATE: ", response);

    const data = response.map.mapData.textData;
    loadHandler(data);
  };

  if (loading) {
    return <div>Loading map templates...</div>;
  }

  return (
    <div className={styles.mapTemplateSelector}>
      <p>Select a Map Template</p>
      {templates.length > 0 ? (
        <ul className={styles.templateList}>
          {templates.map((template) => (
            <li key={template.id}>
              <button
                onClick={() => handleSelect(template)}
                className={styles.mapTemplateButton}
              >
                {template.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No map templates available.</p>
      )}
      {selectedTemplate && (
        <div className={styles.selectedTemplate}>
          <h3 className={styles.text}>Loaded Template:</h3>
          <p className={styles.text}>{selectedTemplate.name}</p>
        </div>
      )}
    </div>
  );
};

export default MapTemplateSelector;
