import { pool } from '../config/database';

interface QuestionnaireResponse {
  questionId: string;
  answer: string | string[] | number;
}

interface Cheese {
  id: number;
  name: string;
  description: string;
  type: string;
  texture: string;
  flavor_profile: any;
  milk_type: string;
  intensity: number;
  image_url: string;
}

interface RecommendationResult {
  cheese: Cheese;
  score: number;
  matchReasons: string[];
}

export class RecommendationService {
  /**
   * Calculate cheese recommendations based on questionnaire responses
   */
  async calculateRecommendations(
    companyId: number,
    responses: QuestionnaireResponse[]
  ): Promise<RecommendationResult[]> {
    // Fetch all cheeses for the company
    const cheeseResult = await pool.query(
      'SELECT * FROM cheeses WHERE company_id = $1',
      [companyId]
    );

    const cheeses: Cheese[] = cheeseResult.rows;

    if (cheeses.length === 0) {
      return [];
    }

    // Convert responses to a map for easier access
    const responseMap = new Map<string, any>();
    responses.forEach(r => {
      responseMap.set(r.questionId, r.answer);
    });

    // Score each cheese
    const scoredCheeses = cheeses.map(cheese => {
      let score = 0;
      const matchReasons: string[] = [];

      // Intensity preference matching
      const intensityPref = responseMap.get('intensity');
      if (intensityPref && cheese.intensity) {
        const intensityDiff = Math.abs(parseInt(intensityPref) - cheese.intensity);
        if (intensityDiff <= 2) {
          score += 30;
          matchReasons.push(`Matches your intensity preference (${intensityPref}/10)`);
        } else if (intensityDiff <= 4) {
          score += 15;
        }
      }

      // Texture preference matching
      const texturePref = responseMap.get('texture');
      if (texturePref && cheese.texture) {
        if (Array.isArray(texturePref)) {
          if (texturePref.includes(cheese.texture.toLowerCase())) {
            score += 25;
            matchReasons.push(`Has your preferred ${cheese.texture} texture`);
          }
        } else if (texturePref.toLowerCase() === cheese.texture.toLowerCase()) {
          score += 25;
          matchReasons.push(`Has your preferred ${cheese.texture} texture`);
        }
      }

      // Milk type preference matching
      const milkTypePref = responseMap.get('milkType');
      if (milkTypePref && cheese.milk_type) {
        if (Array.isArray(milkTypePref)) {
          if (milkTypePref.includes(cheese.milk_type.toLowerCase())) {
            score += 20;
            matchReasons.push(`Made from ${cheese.milk_type} milk`);
          }
        } else if (milkTypePref.toLowerCase() === cheese.milk_type.toLowerCase()) {
          score += 20;
          matchReasons.push(`Made from ${cheese.milk_type} milk`);
        }
      }

      // Cheese type preference matching
      const typePref = responseMap.get('type');
      if (typePref && cheese.type) {
        if (Array.isArray(typePref)) {
          if (typePref.includes(cheese.type.toLowerCase())) {
            score += 25;
            matchReasons.push(`${cheese.type} cheese as you prefer`);
          }
        } else if (typePref.toLowerCase() === cheese.type.toLowerCase()) {
          score += 25;
          matchReasons.push(`${cheese.type} cheese as you prefer`);
        }
      }

      // Flavor profile matching
      const flavorPref = responseMap.get('flavors');
      if (flavorPref && cheese.flavor_profile) {
        const cheeseFlavors = Array.isArray(cheese.flavor_profile) 
          ? cheese.flavor_profile 
          : cheese.flavor_profile.flavors || [];
        
        if (Array.isArray(flavorPref)) {
          const matches = flavorPref.filter(f => 
            cheeseFlavors.some((cf: string) => cf.toLowerCase().includes(f.toLowerCase()))
          );
          if (matches.length > 0) {
            score += matches.length * 10;
            matchReasons.push(`Has flavors you enjoy: ${matches.join(', ')}`);
          }
        }
      }

      return {
        cheese,
        score,
        matchReasons
      };
    });

    // Sort by score descending and return top results
    return scoredCheeses
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Format recommendations for API response
   */
  formatRecommendations(recommendations: RecommendationResult[]) {
    return recommendations.map(r => ({
      id: r.cheese.id,
      name: r.cheese.name,
      description: r.cheese.description,
      type: r.cheese.type,
      texture: r.cheese.texture,
      milkType: r.cheese.milk_type,
      intensity: r.cheese.intensity,
      imageUrl: r.cheese.image_url,
      matchScore: r.score,
      matchReasons: r.matchReasons
    }));
  }
}
