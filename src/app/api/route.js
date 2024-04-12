import {NextResponse} from 'next/server'
const axios = require('axios');
/* Script Variables */
const apiKey = 'AIzaSyDtMvhOawUSFA7JouRPAHeec_PnJZ9xJZM' // Get your key here https://developers.google.com/speed/docs/insights/v5/get-started#APIKey
const cruxEndpoint = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;
// Custom function to extract data from PageSpeed API
const getApiData = async (type, url) => {
    // Create request body
    const req = {}
    req[type] = url
  
    // Send API Request
    const { data } = await axios(cruxEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': `application/json`,
      },
      data: JSON.stringify(req)
    });
    return data
  }

  export async function GET(req) {
    
    try {
        const query = req.query || {};
     const { type = 'origin', url = 'https://www.netcomlearning.com/' } = query;
      // Decode the URL to remove extra characters like %22
      const decodedUrl = decodeURIComponent(url);
      const data = await getApiData(type,decodedUrl);
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.error(new Error('Internal Server Error'));
    }
  }