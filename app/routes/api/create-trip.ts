import { data, type ActionFunctionArgs } from "react-router";
import { GoogleGenAI } from '@google/genai';
import { parseMarkdownToJson } from "assets/lib/utils";
import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        interest,
        budget,
        travelStyle,
        groupType,
        userId
    } = await request.json();

    const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});
    const unsplashKey  = process.env.UNSPLASH_ACCESS_KEY!;


    try {
        const prompt = `
            Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
            Budget: '${budget}'
            Interests: '${interest}'
            TravelStyle: '${travelStyle}'
            GroupType: '${groupType}'

            Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:

            {
            "name": "A descriptive title for the trip",
            "description": "A brief description of the trip and its highlights not exceeding 100 words",
            "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
            "duration": ${numberOfDays},
            "budget": "${budget}",
            "travelStyle": "${travelStyle}",
            "country": "${country}",
            "interests": ${interest},
            "groupType": "${groupType}",
            "rating": "A precise rating on the location as a ratio of 5 eg '4.5'. must no exceed 5"
            "bestTimeToVisit": [
                "🌸 Season (from month to month): reason to visit",
                "☀️ Season (from month to month): reason to visit",
                "🍁 Season (from month to month): reason to visit",
                "❄️ Season (from month to month): reason to visit"
            ],
            "weatherInfo": [
                "☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)",
                "🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)",
                "🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)",
                "❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)"
            ],
            "location": {
                "city": "name of the main city or region",
                "coordinates": [latitude, longitude],
                "openStreetMap": "https://www.openstreetmap.org/#map=10/latitude/longitude"
            },
            "practicalInfo": {
                "budgetBreakdown": {
                    "accommodation": "$X per night average",
                    "food": "$X per day average", 
                    "activities": "$X per day average",
                    "transport": "$X total estimated"
                },
                "packingEssentials": [
                    "Weather-appropriate clothing items",
                    "Cultural consideration items",
                    "Activity-specific gear"
                ],
                "localCustoms": [
                    "Important cultural etiquette tip",
                    "Tipping customs and currency info",
                    "Local customs to be aware of"
                ],
                "emergencyContacts": {
                    "police": "local emergency number",
                    "embassy": "embassy contact info",
                    "medical": "medical emergency number"
                }
            },
            "itinerary": [
                {
                "day": 1,
                "location": "City/Region Name",
                "accommodation": {
                        "area": "Recommended neighborhood",
                        "type": "Hotel/hostel/etc type",
                        "priceRange": "$X-Y per night"
                    },
                "activities": [
                    {
                        "time": "Morning", 
                        "description": "🏰 Visit the local historic castle and enjoy a scenic walk",
                        "specificDetails": "Castle name, address, opening hours, entrance fee",
                        "estimatedCost": "$X",
                        "duration": "2-3 hours"
                    },
                    {
                        "time": "Afternoon", 
                        "description": "🖼️ Explore a famous art museum with a guided tour",
                        "specificDetails": "Museum name, address, tour booking info",
                        "estimatedCost": "$X",
                        "duration": "2-4 hours"
                    },
                    {
                        "time": "Evening", 
                        "description": "🍷 Dine at a rooftop restaurant with local wine",
                        "specificDetails": "Restaurant name, address, reservation requirements",
                        "estimatedCost": "$X",
                        "duration": "2 hours"
                    }
                ],
                "transportation": {
                        "method": "How to get between locations",
                        "cost": "$X estimated",
                        "tips": "Practical transport advice"
                    },
                "totalDayCost": "$X estimated"
                }
            ],
            "alternatives": {
                "weatherBackup": [
                    "Indoor activities for rainy days",
                    "Seasonal alternatives"
                ],
                "budgetAdjustments": {
                    "lowerBudget": "How to reduce costs while maintaining quality",
                    "higherBudget": "Premium upgrades and experiences"
                },
                "extendedStay": [
                    "Day ${numberOfDays + 1}: Additional activity suggestion",
                    "Day ${numberOfDays + 2}: Additional activity suggestion"
                ]
            }
            }

            **Generation Guidelines:**
            - Prioritize authentic local experiences that match the specified interests
            - Include specific names, addresses, and contact information where possible
            - Consider realistic travel times between locations
            - Account for the group type when suggesting accommodations and activities
            - Provide accurate cost estimates based on the budget category
            - Include cultural context and practical tips throughout
            - Ensure activities align with the specified travel style
            - Add weather-appropriate alternatives for each major activity
            - Calculate the total estimated price as the sum of all daily costs plus accommodation
        `;

        const textResult = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [prompt],
        });

        if (!textResult.text) {
            throw new Error("No text generated from AI");
        }

        const trip = parseMarkdownToJson(textResult.text);

        if (!trip) {
            throw new Error("Failed to parse AI response");
        }

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interest} ${travelStyle}&client_id=${unsplashKey}`
        );

        if (!imageResponse.ok) {
            throw new Error(`Unsplash API error: ${imageResponse.status}`);
        }

        const jsonResponse = await imageResponse.json();

        if (!jsonResponse.results) {
            console.warn("No images found");
            // Handle case where no images are returned
        }

        const imageUrl = jsonResponse.results.slice(0, 3).map((result: any) => result.urls?.regular || null);

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetail: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrl,
                userId
            }
        )

        return data({ id: result.$id })
    } catch (error) {
        console.error("Error generating Travel Plan", error)
    }
}