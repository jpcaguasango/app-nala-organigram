const API_BASE_URL = 'http://localhost:3001';

export const fetchOrganigramData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch organigram data:', error);
    throw error;
  }
};

export const saveOrganigramData = async (organigramData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organigramData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    console.log('Save successful:', data.message);

    return data;
  } catch (error) {
    console.error('Failed to save organigram data:', error);
    throw error;
  }
};

export const resetOrganigramData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to reset organigram data:', error);
    throw error;
  }
};
