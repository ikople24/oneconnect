
import { z } from 'zod';
export const regisCity = z.object(
      {
        cityname: z.string().nonempty.max(50,),
        cityarea: z.coerce.number(),
        cityprovince: z.string().nonempty.max(50,),
        citydestrict: z.string().nonempty.max(50,),
        cityvision: z.string().nonempty.max(50,),
      }
)