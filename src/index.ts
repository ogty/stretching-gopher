import express from 'express';
import { match } from 'ts-pattern';
import { Gopher } from './libs/Gopher';
import type { Mascot } from './types/mascot';
import { getContributions } from './utils/getContributions';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req: any, res: any) => {
  try {
    // TODO: do something
    const {
      name: userName,
      mascot: mascotName,
      bodyColor,
      noseColor,
      handColor,
      footColor,
    } = req.query;
    const contributions = await getContributions(userName);

    const svg = match(mascotName as Mascot)
      .with('gopher', () => {
        const gopher = new Gopher();
        const svg = gopher.setTemplate({
          height: contributions * 10,
          bodyColor: bodyColor || '#6ad6e4',
          noseColor: noseColor || '#f6d2a2',
          handColor: handColor || '#f6d2a2',
          footColor: footColor || '#f6d2a2',
        });
        return svg;
      })
      .exhaustive();

    res.set('Cache-Control', 'no-store');
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 3000);

export default app;
