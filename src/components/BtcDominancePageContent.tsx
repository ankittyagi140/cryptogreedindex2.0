"use client";

import { useQuery } from "@tanstack/react-query";

import BtcDominanceChart, {
  BtcDominanceApiResponse,
} from "@/components/BtcDominanceChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function BtcDominancePageContent() {
  const { language, t } = useLanguage();

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useQuery<BtcDominanceApiResponse>({
    queryKey: ["btc-dominance", "summary"],
    queryFn: async () => {
      const response = await fetch("/api/btc-dominance?period=24h");
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json() as Promise<BtcDominanceApiResponse>;
    },
    staleTime: 86_400_000,
    refetchInterval: 86_400_000,
  });

  const summaryPoints = summaryData?.points ?? [];
  const latestPoint = summaryPoints.length
    ? summaryPoints[summaryPoints.length - 1]
    : undefined;
  const baselinePoint = summaryPoints.length ? summaryPoints[0] : undefined;

  const dominanceValue =
    typeof latestPoint?.dominance === "number" ? latestPoint.dominance : null;
  const changeValue =
    latestPoint && baselinePoint
      ? latestPoint.dominance - baselinePoint.dominance
      : null;

  const dominanceDisplay =
    dominanceValue === null
      ? "--"
      : `${dominanceValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`;

  const summaryTone =
    changeValue === null
      ? "neutral"
      : changeValue > 0
      ? "positive"
      : changeValue < 0
      ? "negative"
      : "neutral";

  const changeBadgeClass =
    summaryTone === "positive"
      ? "bg-emerald-500/20 text-emerald-300"
      : summaryTone === "negative"
      ? "bg-rose-500/20 text-rose-300"
      : "bg-border/50 text-muted-foreground";

  const changeBadgeLabel =
    changeValue === null
      ? "--"
      : `${changeValue >= 0 ? "▲" : "▼"} ${Math.abs(changeValue).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}%`;

  type DominanceContent = {
    understandingTitle: string;
    understandingParagraphs: string[];
    highTitle: string;
    highBullets: string[];
    lowTitle: string;
    lowBullets: string[];
    historicalTitle: string;
    historicalIntro: string;
    historicalCards: Array<{ title: string; body: string }>;
    tradingTitle: string;
    tradingIntro: string;
    tradingColumns: Array<
      Array<{ title: string; body: string; accent: "emerald" | "blue" }>
    >;
    tradingOutro: string;
    factorsTitle: string;
    factorsIntro: string;
    factorsColumns: Array<{
      title: string;
      accent: "yellow" | "rose";
      bullets: string[];
    }>;
    factorsOutro: string;
  };

  const localizedContent: Record<string, DominanceContent> = {
    en: {
      understandingTitle: "Bitcoin Dominance Analysis",
      understandingParagraphs: [
        "Bitcoin dominance expresses Bitcoin's share of the total cryptocurrency market capitalization. Monitoring this ratio helps investors gauge how strongly capital favours Bitcoin versus the wider digital-asset universe.",
        "Because Bitcoin remains the most established crypto asset, shifts in its dominance often hint at broader risk appetite: rising dominance usually signals a flight to safety, while falling dominance points to capital rotating into altcoins.",
      ],
      highTitle: "Implications of High Dominance",
      highBullets: [
        "Strong Bitcoin market position",
        "Reduced altcoin market share",
        "Potential market consolidation",
        "Greater confidence from traditional finance",
        "Heightened institutional participation",
        "Risk-off or defensive sentiment",
      ],
      lowTitle: "Implications of Low Dominance",
      lowBullets: [
        "Altcoin season potential",
        "Market diversification",
        "Increased market maturity",
        "Accelerated innovation in the altcoin space",
        "Broader crypto market expansion",
        "Higher investor risk appetite",
      ],
      historicalTitle: "Bitcoin Dominance Through the Years",
      historicalIntro:
        "Bitcoin dominance has moved in clear cycles since the first altcoins arrived. Reviewing these phases provides context for today's market structure.",
      historicalCards: [
        {
          title: "Early Monopoly (2009-2017)",
          body: "For almost a decade Bitcoin commanded over 80% of crypto's market cap. Only in 2017, with the first major altcoin boom, did that grip begin to loosen.",
        },
        {
          title: "Market Cycles (2017-2022)",
          body: "Across subsequent cycles dominance typically climbed during bear phases—capital seeking Bitcoin's relative safety—and fell during bull runs when risk appetite returned to altcoins.",
        },
        {
          title: "Institutional Era (2020 onward)",
          body: "Institutional adoption has introduced new flows. Many large allocators still concentrate on Bitcoin for its liquidity and regulatory clarity, shaping dominance behaviour.",
        },
      ],
      tradingTitle: "Using Dominance in Trading Strategies",
      tradingIntro:
        "Traders often pair price analysis with dominance to judge when capital is rotating between Bitcoin and the rest of the market:",
      tradingColumns: [
        [
          {
            title: "Dominance breakouts:",
            body:
              " Strong moves in dominance trendlines frequently precede large rotations between Bitcoin and altcoins",
            accent: "emerald",
          },
          {
            title: "Divergence trading:",
            body:
              " Watching divergence between BTC price and dominance can surface hidden shifts in sentiment",
            accent: "emerald",
          },
          {
            title: "Sector rotation timing:",
            body:
              " Dominance trends help time rotations among Bitcoin, large-cap altcoins, and higher-risk assets",
            accent: "emerald",
          },
        ],
        [
          {
            title: "Market cycle identification:",
            body:
              " Historical dominance zones assist in identifying where we sit in the broader crypto cycle",
            accent: "blue",
          },
          {
            title: "Portfolio rebalancing:",
            body:
              " Traders adjust Bitcoin-to-altcoin allocations as dominance rises or falls to manage risk",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "Our dominance tracker provides real-time context so you can act on these signals quickly.",
      factorsTitle: "What Moves Bitcoin Dominance?",
      factorsIntro:
        "Several forces push Bitcoin's share of the market higher or lower:",
      factorsColumns: [
        {
          title: "Market Forces",
          accent: "yellow",
          bullets: [
            "Macroeconomic conditions",
            "Institutional investment flows",
            "Retail investor sentiment",
            "Trading volume distribution",
            "Liquidity across exchanges",
          ],
        },
        {
          title: "Technological Developments",
          accent: "rose",
          bullets: [
            "Bitcoin network upgrades",
            "Layer 2 scaling solutions",
            "Innovations in alternative blockchains",
            "DeFi and NFT ecosystem growth",
            "Regulatory developments",
          ],
        },
      ],
      factorsOutro:
        "Tracking these drivers alongside dominance metrics gives a wider view of where capital is flowing.",
    },
    es: {
      understandingTitle: "Dominancia de Bitcoin, explicada",
      understandingParagraphs: [
        "La dominancia de Bitcoin mide qué parte de la capitalización total del mercado cripto corresponde a BTC. Observar este ratio ayuda a evaluar la preferencia del mercado por Bitcoin frente al resto de activos.",
        "Cuando la dominancia sube suele indicar una postura más defensiva; cuando baja, el mercado tiende a migrar para altcoins en busca de mayor retorno al asumir más riesgo.",
      ],
      highTitle: "Cuando la dominancia es alta",
      highBullets: [
        "Posición de mercado muy fuerte para el Bitcoin",
        "Participación menor de las altcoins",
        "Posible fase de consolidación",
        "Mayor confianza del sistema financiero tradicional",
        "Interés institucional en crecimiento",
        "Sentimiento de aversión al riesgo en el mercado",
      ],
      lowTitle: "Cuando la dominancia cae",
      lowBullets: [
        "Potencial de temporada de altcoins",
        "Diversificación más amplia",
        "Ecosistema más maduro",
        "Innovación acelerada fuera de Bitcoin",
        "Expansión del mercado cripto",
        "Inversores asumiendo más riesgo",
      ],
      historicalTitle: "Dominancia a lo largo de los años",
      historicalIntro:
        "Desde que surgieron las altcoins, la dominancia de Bitcoin ha seguido ciclos claros. Entender estas fases ayuda a interpretar el estado actual del mercado.",
      historicalCards: [
        {
          title: "Monopólio inicial (2009-2017)",
          body: "Por casi una década el Bitcoin representó más del 80% del mercado. Solo en 2017, con el primer gran boom de altcoins, esta participación comenzó a reducirse.",
        },
        {
          title: "Ciclos de mercado (2017-2022)",
          body: "En mercados de baja la dominancia tiende a subir por la búsqueda de seguridad del BTC; en mercados de alta cae cuando el apetito por riesgo vuelve a las altcoins.",
        },
        {
          title: "Era institucional (2020 en diante)",
          body: "La entrada de inversores institucionales trajo nuevos flujos. Muchos aún priorizan el Bitcoin por su liquidez y claridad regulatoria, influyendo en el comportamiento de la dominancia.",
        },
      ],
      tradingTitle: "Cómo usar la dominancia en tu estrategia",
      tradingIntro:
        "Combinar análisis de precio con dominancia ayuda a identificar cuándo el capital está migrando entre Bitcoin y otras monedas:",
      tradingColumns: [
        [
          {
            title: "Rompimentos de dominancia:",
            body:
              " Movimientos fuertes en las líneas de tendencia a menudo preceden a grandes rotaciones entre BTC y altcoins",
            accent: "emerald",
          },
          {
            title: "Operar divergencias:",
            body:
              " Las divergencias entre el precio del BTC y la dominancia pueden revelar cambios sutiles de sentimiento",
            accent: "emerald",
          },
          {
            title: "Timing de rotación de sectores:",
            body:
              " Los movimientos de dominancia ayudan a decidir cuándo pasar de Bitcoin a altcoins grandes o pequeñas",
            accent: "emerald",
          },
        ],
        [
          {
            title: "Identificar el ciclo:",
            body:
              " Zonas históricas de dominancia ayudan a entender en qué fase del ciclo cripto estamos",
            accent: "blue",
          },
          {
            title: "Rebalanceo de carteira:",
            body:
              " Ajustar la proporción entre Bitcoin y altcoins según la dominancia varía mejora el control de riesgo",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "Nuestro monitor en tiempo real facilita aplicar estas ideas con datos actualizados.",
      factorsTitle: "Factores que mueven la dominancia",
      factorsIntro:
        "Diversos factores pueden provocar cambios en la dominancia de Bitcoin:",
      factorsColumns: [
        {
          title: "Fuerzas de mercado",
          accent: "yellow",
          bullets: [
            "Condiciones macroeconómicas",
            "Flujos de capital institucional",
            "Sentimiento minorista",
            "Distribución del volumen de trading",
            "Liquidez entre exchanges",
          ],
        },
        {
          title: "Desarrollos tecnológicos",
          accent: "rose",
          bullets: [
            "Mejoras en la red Bitcoin",
            "Soluciones de segunda capa",
            "Innovación en blockchains alternativas",
            "Crecimiento de DeFi y NFTs",
            "Cambios regulatorios",
          ],
        },
      ],
      factorsOutro:
        "Al seguir estos factores junto con las métricas de dominancia, los inversores obtienen una visión más completa de la dinámica del mercado y de las posibles tendencias futuras.",
    },
    de: {
      understandingTitle: "Was bedeutet Bitcoin-Dominanz?",
      understandingParagraphs: [
        "Die Bitcoin-Dominanz zeigt, wie groß der Anteil von Bitcoin an der gesamten Marktkapitalisierung des Kryptomarkts ist. Wer sie beobachtet, erkennt ob Kapital eher in Bitcoin oder in Altcoins fließt.",
        "Steigt die Dominanz, suchen Anleger häufig die relative Sicherheit von Bitcoin; sinkt sie, erhöht sich meist der Risikoappetit und Kapital wandert in Altcoins.",
      ],
      highTitle: "Wenn die Dominanz hoch ist",
      highBullets: [
        "Starke Marktposition von Bitcoin",
        "Altcoins verlieren Marktanteile",
        "Markt konsolidiert sich",
        "Höheres Vertrauen traditioneller Akteure",
        "Defensiver Risikoappetit",
      ],
      lowTitle: "Wenn die Dominanz sinkt",
      lowBullets: [
        "Potenzial für eine Altcoin-Saison",
        "Breitere Diversifikation",
        "Reifere Marktstruktur",
        "Mehr Innovation im Altcoin-Sektor",
        "Wachsender Gesamtmarkt",
        "Höhere Risikobereitschaft",
      ],
      historicalTitle: "Historischer Blick auf die Dominanz",
      historicalIntro:
        "Seit den ersten Altcoins hat sich die Dominanz von Bitcoin in wiederkehrenden Mustern bewegt – ein guter Anhaltspunkt für die heutige Marktstruktur.",
      historicalCards: [
        {
          title: "Frühes Monopol (2009-2017)",
          body: "Bis 2017 hielt Bitcoin häufig über 80 % der Marktkapitalisierung, ehe der erste große Altcoin-Bullenmarkt den Anteil deutlich reduzierte.",
        },
        {
          title: "Marktzyklen (2017-2022)",
          body: "In Bärenmärkten zieht Kapital in Richtung Bitcoin und die Dominanz steigt; in Bullenmärkten wandern Mittel in Altcoins und der Anteil sinkt.",
        },
        {
          title: "Institutionelle Ära (seit 2020)",
          body: "Der Einstieg institutioneller Anleger sorgt für neue Ströme: wegen Liquidität und Regulierung bevorzugen viele große Akteure weiterhin Bitcoin.",
        },
      ],
      tradingTitle: "Dominanz im Trading sinnvoll einsetzen",
      tradingIntro:
        "Wer Preisbewegungen mit Dominanzdaten kombiniert, erkennt Kapitalumschichtungen frühzeitig:",
      tradingColumns: [
        [
          {
            title: "Dominanz-Ausbrüche:",
            body:
              " Deutliche Brüche in Trendlinien signalisieren oft große Markt-rotationen",
            accent: "emerald",
          },
          {
            title: "Divergenz-Handel:",
            body:
              " Abweichungen zwischen BTC-Preis und Dominanz offenbaren versteckte Marktbewegungen",
            accent: "emerald",
          },
          {
            title: "Sektor-Rotation:",
            body:
              " Dominanzverschiebungen helfen beim Timing zwischen Bitcoin, Large-Cap-Altcoins und kleineren Projekten",
            accent: "emerald",
          },
        ],
        [
          {
            title: "Marktzyklus erkennen:",
            body:
              " Historical dominance zones assist in identifying where we sit in the broader crypto cycle",
            accent: "blue",
          },
          {
            title: "Portfolio-Rebalancing:",
            body:
              " Traders adjust Bitcoin-to-altcoin allocations as dominance rises or falls to manage risk",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "Unser Live-Tracker unterstützt dabei mit aktuellen Dominanzdaten, die schnell auf Marktveränderungen reagieren.",
      factorsTitle: "Einflussfaktoren der BTC-Dominanz",
      factorsIntro:
        "Mehrere Faktoren können die Dominanz von Bitcoin verschieben:",
      factorsColumns: [
        {
          title: "Marktkräfte",
          accent: "yellow",
          bullets: [
            "Makroökonomische Rahmenbedingungen",
            "Institutionelle Kapitalströme",
            "Stimmung privater Anleger",
            "Verteilung des Handelsvolumens",
            "Liquidität an Börsen",
          ],
        },
        {
          title: "Technologische Entwicklungen",
          accent: "rose",
          bullets: [
            "Upgrades im Bitcoin-Netzwerk",
            "Layer-2-Skalierungslösungen",
            "Innovation auf alternativen Blockchains",
            "Wachstum von DeFi und NFTs",
            "Regulatorische Entwicklungen",
          ],
        },
      ],
      factorsOutro:
        "Wer diese Faktoren gemeinsam mit Dominanzdaten beobachtet, erhält ein umfassenderes Bild der Markt-dynamik und möglicher Trends.",
    },
    pt: {
      understandingTitle: "Dominância do Bitcoin em foco",
      understandingParagraphs: [
        "A dominância do Bitcoin indica qual parcela da capitalização total do mercado cripto pertence ao BTC. Acompanhar esse índice ajuda a entender quando o capital prefere o Bitcoin ou busca oportunidades em outras moedas.",
        "Quando a dominância sobe é comum ver uma postura mais defensiva; quando cai, o mercado tende a migrar para altcoins em busca de maior retorno ao assumir mais risco.",
      ],
      highTitle: "Quando a dominância está alta",
      highBullets: [
        "Posição de mercado muito forte para o Bitcoin",
        "Participação menor das altcoins",
        "Possível fase de consolidação",
        "Maior confiança do sistema financeiro tradicional",
        "Interesse institucional em crescimento",
        "Sentimento de aversão ao risco no mercado",
      ],
      lowTitle: "Quando a dominância cai",
      lowBullets: [
        "Potencial de temporada das altcoins",
        "Diversificação mais ampla",
        "Maturidade crescente do ecossistema",
        "Inovação acelerada fora do Bitcoin",
        "Expansão do mercado cripto",
        "Investidores assumindo mais risco",
      ],
      historicalTitle: "Dominância do Bitcoin ao longo dos anos",
      historicalIntro:
        "Desde o surgimento das altcoins, a dominância do Bitcoin acompanha ciclos claros. Entender essas fases ajuda a interpretar o cenário atual.",
      historicalCards: [
        {
          title: "Monopólio inicial (2009-2017)",
          body: "Por quase uma década o Bitcoin representou mais de 80% do mercado. Apenas em 2017, com o primeiro grande boom das altcoins, essa participação começou a diminuir.",
        },
        {
          title: "Ciclos de mercado (2017-2022)",
          body: "Em mercados de baixa a dominância tende a subir pela busca de segurança do BTC; em mercados de alta cai quando o apetite por risco volta às altcoins.",
        },
        {
          title: "Era institucional (2020 em diante)",
          body: "A entrada de investidores institucionais trouxe novos fluxos. Muitos ainda priorizam o Bitcoin pela liquidez e clareza regulatória, influenciando o comportamento da dominância.",
        },
      ],
      tradingTitle: "Como usar a dominância na sua estratégia",
      tradingIntro:
        "Combinar análise de preço com dominância ajuda a identificar quando o capital está migrando entre Bitcoin e outras moedas:",
      tradingColumns: [
        [
          {
            title: "Rompimentos de dominância:",
            body:
              " Movimentos fortes na linha de tendência frequentemente antecedem grandes rotações entre Bitcoin e altcoins",
            accent: "emerald",
          },
          {
            title: "Operar divergências:",
            body:
              " Divergências entre o preço do BTC e a dominância podem revelar mudanças sutis de sentimento",
            accent: "emerald",
          },
          {
            title: "Timing de rotação de setores:",
            body:
              " Acompanhar a dominância orienta o movimento entre Bitcoin, grandes altcoins e projetos de maior risco",
            accent: "emerald",
          },
        ],
        [
          {
            title: "Identificação do ciclo:",
            body:
              " Zonas históricas de dominância ajudam a entender em qual fase do ciclo cripto estamos",
            accent: "blue",
          },
          {
            title: "Rebalanceamento de carteira:",
            body:
              " Ajustar a proporção entre Bitcoin e altcoins conforme a dominância varia melhora o controle de risco",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "Nosso monitor de dominância em tempo real fornece contexto imediato para agir com confiança.",
      factorsTitle: "O que move a dominância do Bitcoin?",
      factorsIntro:
        "Diversas forças empurram a dominância para cima ou para baixo:",
      factorsColumns: [
        {
          title: "Forças de mercado",
          accent: "yellow",
          bullets: [
            "Cenário macroeconômico",
            "Fluxos de capital institucional",
            "Sentimento de investidores de varejo",
            "Distribuição do volume negociado",
            "Liquidez entre corretoras",
          ],
        },
        {
          title: "Desenvolvimentos tecnológicos",
          accent: "rose",
          bullets: [
            "Atualizações na rede Bitcoin",
            "Soluções de segunda camada",
            "Inovações em outras blockchains",
            "Crescimento de DeFi e NFTs",
            "Evolução regulatória",
          ],
        },
      ],
      factorsOutro:
        "Avaliar esses fatores junto com a dominância amplia a visão sobre para onde o capital está fluindo.",
    },
    ja: {
      understandingTitle: "ビットコインドミナンスを読み解く",
      understandingParagraphs: [
        "ビットコイン・ドミナンスは、暗号資産市場全体に占めるビットコインの時価総額比率を示します。この比率を追うことで、市場がビットコインをどの程度重視しているかを把握できます。",
        "ドミナンスが上昇しているときは安全資産を求める動きが強まり、低下しているときはリスクを取ってアルトコインへ資金が移る傾向があります。",
      ],
      highTitle: "ドミナンスが高いとき",
      highBullets: [
        "ビットコインの圧倒的な市場シェア",
        "アルトコインの存在感が低下",
        "市場の調整・停滞局面",
        "伝統 金融からの信頼度が上昇",
        "機関投資家の参加が拡大",
        "リスク回避志向の強まり",
      ],
      lowTitle: "ドミナンスが低いとき",
      lowBullets: [
        "アルトコインシーズン到来の可能性",
        "市場の多様化が進む",
        "エコシステムの成熟化",
        "ビットコイン以外でのイノベーション加速",
        "暗号資産市場全体の拡大",
        "投資家のリスク許容度が上昇",
      ],
      historicalTitle: "歴史で見るビットコインドミナンス",
      historicalIntro:
        "アルトコインの登場 以降、ビットコインドミナンスは 反復的な サイクルを示してきました。各時期を理解することで、現在の市場構造を読み解くのに役立ちます。",
      historicalCards: [
        {
          title: "初期の独占 (2009〜2017年)",
          body: "2017年まではビットコインが市場の80% 以上を占めていました。最初のアルトコイン 強気相場が 初めてその独占を崩れ始めました。",
        },
        {
          title: "マーケットサイクル (2017〜2022年)",
          body: "ベア相場では安全資産 優先で ドミナンスが上昇、ブル相場ではリスク志向が高まりアルトコインへ資金が流れドミナンスが低下する傾向が 反復されました。",
        },
        {
          title: "機関投資家の時代 (2020~)",
          body: "機関投資家の流入により新たな資金 フローが 生まれました。規制と流動性 面でビットコインを優先する傾向は依然としてドミナンスに影響を与えています。",
        },
      ],
      tradingTitle: "トレード戦略にドミナンスを活用する",
      tradingIntro:
        "価格 分析と ドミナンスを 組み合わせることで、資金が ビットコインと 他の資産 間で どのように 移動しているかを 読むことができます。",
      tradingColumns: [
        [
          {
            title: "ドミナンスのブレイク:",
            body:
              " トレンドラインの明確な突破は、ビットコインとアルトコイン 間の 大規模な 資金移動を 予告します",
            accent: "emerald",
          },
          {
            title: "ダイバージェンス 取引:",
            body:
              " ビットコイン価格とドミナンスの 乖離を 観察することで、 隠れた 心理 変化を 早期に 捉えることができます",
            accent: "emerald",
          },
          {
            title: "セクターローテーションのタイミング:",
            body:
              " ドミナンスの推移は、ビットコイン、大型アルト、高リスク 資産 間の 移動 タイミングを 推測するのに 役立ちます",
            accent: "emerald",
          },
        ],
        [
          {
            title: "市場 サイクルの把握:",
            body:
              " 歴史的な ドミナンス レベルから、現在の 市場 サイクルの 位置を 推測することができます",
            accent: "blue",
          },
          {
            title: "ポートフォリオのリバランス:",
            body:
              " ドミナンスの変化に応じてビットコインとアルトコインの比率を調整し、リスクを管理します",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "リアルタイムのドミナンストラッカーは、こうした戦略を 迅速に 実行するための 判断材料を 提供します。",
      factorsTitle: "ドミナンスを動かす要因",
      factorsIntro:
        "以下の要因が ドミナンスを 上昇させるか 下降させる可能性があります：",
      factorsColumns: [
        {
          title: "市場要因",
          accent: "yellow",
          bullets: [
            "マクロ経済の環境",
            "機関投資家の資金フロー",
            "個人投資家のセンチメント",
            "取引高の配分",
            "取引所間の流動性",
          ],
        },
        {
          title: "技術的な進展",
          accent: "rose",
          bullets: [
            "ビットコイン ネットワークのアップグレード",
            "レイヤー2 の普及",
            "他チェーンでの技術革新",
            "DeFi と NFT エコシステムの拡大",
            "規制動向の変化",
          ],
        },
      ],
      factorsOutro:
        "これらの要因と ドミナンスを 組み合わせて 観察することで、資金の流れを より 立体的に 理解することができます。",
    },
    ko: {
      understandingTitle: "비트코인 도미넌스 분석",
      understandingParagraphs: [
        "비트코인 도미넌스는 전체 암호화폐 시가총액에서 비트코인이 차지하는 비중을 의미합니다. 이 지표를 살펴보면 시장 자금이 비트코인에 집중되는지, 혹은 다른 자산으로 이동하는지 파악할 수 있습니다.",
        "도미넌스가 상승하면 투자자들이 상대적으로 안전한 비트코인으로 이동하는 경향이 있고, 하락하면 더 높은 수익을 노리고 알트코인으로 자금이 분산되는 경우가 많습니다.",
      ],
      highTitle: "도미넌스가 높을 때",
      highBullets: [
        "비트코인의 강한 시장 지위",
        "알트코인 시장점유율 축소",
        "시장 조정 혹은 횡보 국면",
        "전통 금융권의 신뢰도 상승",
        "기관투자자 유입 확대",
        "리스크 회피 심리 강화",
      ],
      lowTitle: "도미넌스가 낮을 때",
      lowBullets: [
        "알트코인 시즌 가능성",
        "시장 다각화 진행",
        "생태계 성숙도 향상",
        "알트코인 영역에서의 혁신 가속",
        "암호화폐 시장 전체 확장",
        "투자자의 위험 선호도 상승",
      ],
      historicalTitle: "역사로 살펴본 비트코인 도미넌스",
      historicalIntro:
        "알트코인의 등장 이후, 비트코인 도미넌스는 반복적인 사이클을 보여 왔습니다. 각 시기를 이해하면 현재의 시장 구조를 읽는 데 도움이 됩니다.",
      historicalCards: [
        {
          title: "초기 독점기 (2009~2017)",
          body: "2017년까지 비트코인은 시장의 80% 이상을 차지했습니다. 첫 대규모 알트코인 강세장이 나타나면서 비로소 그 비중이 축소되기 시작했습니다.",
        },
        {
          title: "시장 사이클 (2017~2022)",
          body: "약세장에서는 안전자산 선호로 도미넌스가 상승하고, 강세장에서는 수익을 좇는 자금이 알트코인으로 이동해 도미넌스가 하락하는 패턴이 반복되었습니다.",
        },
        {
          title: "기관 자금의 시대 (2020~)",
          body: "기관투자자의 유입으로 새로운 자금 흐름이 생겼습니다. 규제와 유동성 측면에서 비트코인을 선호하는 경향이 여전히 도미넌스에 영향을 줍니다.",
        },
      ],
      tradingTitle: "도미넌스를 활용한 트레이딩 전략",
      tradingIntro:
        "가격 분석과 도미넌스를 함께 보면 자금이 비트코인과 다른 자산 사이에서 어떻게 이동하는지 읽을 수 있습니다.",
      tradingColumns: [
        [
          {
            title: "도미넌스 돌파:",
            body:
              " 추세선 돌파와 같은 강한 움직임은 비트코인과 알트코인 간의 대규모 자금 이동을 예고합니다",
            accent: "emerald",
          },
          {
            title: "다이버전스 매매:",
            body:
              " 비트코인 가격과 도미넌스의 괴리를 관찰하면 숨은 심리 변화를 포착할 수 있습니다",
            accent: "emerald",
          },
          {
            title: "섹터 로테이션 타이밍:",
            body:
              " 도미넌스 흐름은 비트코인, 대형 알트, 고위험 자산 간 이동 시점을 가늠하는 데 도움을 줍니다",
            accent: "emerald",
          },
        ],
        [
          {
            title: "시장 사이클 파악:",
            body:
              " 역사적 도미넌스 구간을 통해 현재 시장 사이클의 위치를 유추할 수 있습니다",
            accent: "blue",
          },
          {
            title: "포트폴리오 리밸런싱:",
            body:
              " 도미넌스 변화에 따라 비트코인과 알트코인의 비중을 조절하면 리스크 관리에 유리합니다",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "실시간 도미넌스 트래커는 이러한 전략을 신속히 실행할 수 있도록 즉각적인 정보를 제공합니다.",
      factorsTitle: "비트코인 도미넌스에 영향을 주는 요인",
      factorsIntro:
        "다음과 같은 요인이 도미넌스를 높이거나 낮춥니다:",
      factorsColumns: [
        {
          title: "시장 요인",
          accent: "yellow",
          bullets: [
            "거시경제 환경",
            "기관 자금 유입",
            "개인 투자자 심리",
            "거래량 분포",
            "거래소 간 유동성",
          ],
        },
        {
          title: "기술 발전",
          accent: "rose",
          bullets: [
            "비트코인 네트워크 업그레이드",
            "레이어2 확산",
            "대체 블록체인의 혁신",
            "DeFi 및 NFT 생태계 성장",
            "규제 변화",
          ],
        },
      ],
      factorsOutro:
        "이러한 요인과 도미넌스를 함께 살피면 자금 흐름을 더욱 입체적으로 이해할 수 있습니다.",
    },
    hi: {
      understandingTitle: "बिटकॉइन प्रभुत्व का विश्लेषण",
      understandingParagraphs: [
        "बिटकॉइन प्रभुत्व यह दिखाता है कि कुल क्रिप्टो मार्केट कैप का कितना हिस्सा बिटकॉइन के पास है। इस अनुपात को देखने से समझ आता है कि पूँजी बिटकॉइन में सुरक्षित रहना चाहती है या अन्य परिसंपत्तियों की तलाश में है।",
        "जब प्रभुत्व बढ़ता है तो निवेशक अक्सर सुरक्षा की तरफ झुकते हैं, जबकि प्रभुत्व घटने पर जोखिम लेने की प्रवृत्ति बढ़ती है और धन अल्टकॉइन्स की ओर शिफ्ट होता है।",
      ],
      highTitle: "उच्च प्रभुत्व के संकेत",
      highBullets: [
        "बिटकॉइन की मजबूत बाज़ार स्थिति",
        "अल्टकॉइन की हिस्सेदारी में कमी",
        "बाज़ार में समेकन की संभावना",
        "पारंपरिक वित्तीय संस्थानों का भरोसा",
        "संस्थागत निवेश बढ़ना",
        "बाज़ार में सावधानी भरा रुझान",
      ],
      lowTitle: "निम्न प्रभुत्व के संकेत",
      lowBullets: [
        "अल्टकॉइन सीज़न की संभावना",
        "बाज़ार में विविधीकरण",
        "क्रिप्टो पारिस्थितिकी तंत्र की परिपक्वता",
        "अल्टकॉइन क्षेत्र में तेज़ नवाचार",
        "संपूर्ण क्रिप्टो बाज़ार का विस्तार",
        "निवेशकों की जोखिम लेने की इच्छा बढ़ना",
      ],
      historicalTitle: "इतिहास में बिटकॉइन प्रभुत्व",
      historicalIntro:
        "अल्टकॉइन आने के बाद से बिटकॉइन प्रभुत्व स्पष्ट चक्रों में घूमता रहा है। इन चरणों को समझना वर्तमान बाज़ार संरचना को समझने में मदद करता है।",
      historicalCards: [
        {
          title: "प्रारंभिक एकाधिकार (2009-2017)",
          body: "लगभग एक दशक तक बिटकॉइन ने बाज़ार की 80% से अधिक हिस्सेदारी सँभाली। 2017 में पहली बड़ी अल्टकॉइन रैली ने इस प्रभुत्व को चुनौती देना शुरू किया।",
        },
        {
          title: "बाज़ार चक्र (2017-2022)",
          body: "मंदी के दौर में निवेशक बिटकॉइन को सुरक्षित मानते हैं और प्रभुत्व बढ़ता है, जबकि तेजी के दौर में अधिक लाभ की तलाश में धन अल्टकॉइन्स में जाता है और प्रभुत्व घटता है।",
        },
        {
          title: "संस्थागत युग (2020 से)",
          body: "संस्थागत निवेश के आने से नए धन प्रवाह बने। उच्च तरलता और नियामकीय स्पष्टता के कारण बड़ी संस्थाएँ अब भी बिटकॉइन को तरजीह देती हैं, जिससे प्रभुत्व के पैटर्न प्रभावित होते हैं।",
        },
      ],
      tradingTitle: "प्रभुत्व को रणनीति में कैसे शामिल करें",
      tradingIntro:
        "मूल्य विश्लेषण के साथ प्रभुत्व को जोड़ने से पता चलता है कि पूँजी बिटकॉइन से अन्य परिसंपत्तियों की ओर कब घूम रही है।",
      tradingColumns: [
        [
          {
            title: "प्रभुत्व ब्रेकआउट:",
            body:
              " प्रभुत्व ट्रेंडलाइन में तेज़ बदलाव अक्सर बिटकॉइन और अल्टकॉइन के बीच बड़े पूँजी प्रवाह का संकेत देते हैं",
            accent: "emerald",
          },
          {
            title: "डाइवर्जेन्स ट्रेडिंग:",
            body:
              " बिटकॉइन कीमत और प्रभुत्व में अन्तर निवेशक भावना में छिपे बदलाव को दर्शा सकता है",
            accent: "emerald",
          },
          {
            title: "सेक्टर रोटेशन का समय:",
            body:
              " प्रभुत्व के रुझान से समझ आता है कि कब बिटकॉइन, बड़ी अल्टकॉइन और उच्च जोखिम वाली परिसंपत्तियों के बीच स्थानांतरण करना चाहिए",
            accent: "emerald",
          },
        ],
        [
          {
            title: "बाज़ार चक्र की पहचान:",
            body:
              " ऐतिहासिक प्रभुत्व के स्तर बताते हैं कि हम क्रिप्टो चक्र के किस हिस्से में हैं",
            accent: "blue",
          },
          {
            title: "पोर्टफोलियो री-बैलेंसिंग:",
            body:
              " प्रभुत्व के बढ़ने-घटने के साथ बिटकॉइन और अल्टकॉइन की हिस्सेदारी बदलकर जोखिम को नियंत्रित किया जा सकता है",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "हमारा रीयल-टाइम प्रभुत्व ट्रैकर इन संकेतों पर तुरंत कार्रवाई करने के लिए आवश्यक संदर्भ देता है।",
      factorsTitle: "बिटकॉइन प्रभुत्व को प्रभावित करने वाले कारक",
      factorsIntro:
        "कई शक्तियाँ बिटकॉइन की हिस्सेदारी को ऊपर या नीचे धकेलती हैं:",
      factorsColumns: [
        {
          title: "बाज़ार शक्तियाँ",
          accent: "yellow",
          bullets: [
            "मैक्रो आर्थिक हालात",
            "संस्थागत निवेश प्रवाह",
            "रिटेल निवेशकों की भावना",
            "ट्रेडिंग वॉल्यूम का वितरण",
            "एक्सचेंजों के बीच तरलता",
          ],
        },
        {
          title: "प्रौद्योगिकी विकास",
          accent: "rose",
          bullets: [
            "बिटकॉइन नेटवर्क अपग्रेड",
            "लेयर 2 समाधान",
            "अन्य ब्लॉकचेन में नवाचार",
            "Wachstum von DeFi und NFTs",
            "Regulatorische Entwicklungen",
          ],
        },
      ],
      factorsOutro:
        "इन कारकों को प्रभुत्व डेटा के साथ ट्रैक करने से पूँजी प्रवाह की व्यापक तस्वीर मिलती है।",
    },
    fr: {
      understandingTitle: "Analyse de la dominance du Bitcoin",
      understandingParagraphs: [
        "La dominance du Bitcoin représente la part de la capitalisation totale du marché crypto détenue par le BTC. La suivre permet d'évaluer si les capitaux privilégient la sécurité du Bitcoin ou se tournent vers d'autres actifs.",
        "Une dominance en hausse signale souvent une recherche de sécurité, tandis qu'une baisse indique un transfert de capitaux vers les altcoins pour capter davantage de rendement.",
      ],
      highTitle: "Quand la dominance est élevée",
      highBullets: [
        "Position de marché très solide pour le Bitcoin",
        "Réduction de la part des altcoins",
        "Phase de consolidation probable",
        "Confiance accrue de la finance traditionnelle",
        "Participation institutionnelle renforcée",
        "Sentiment défensif sur le marché",
      ],
      lowTitle: "Quand la dominance recule",
      lowBullets: [
        "Potentiel de saison des altcoins",
        "Diversification plus large",
        "Écosystème crypto plus mature",
        "Innovation accélérée hors Bitcoin",
        "Expansion du marché des crypto-actifs",
        "Appétit pour le risque plus élevé",
      ],
      historicalTitle: "La dominance du Bitcoin au fil du temps",
      historicalIntro:
        "Depuis l'arrivée des altcoins, la dominance du Bitcoin suit des cycles marqués. Les analyser aide à comprendre la structure actuelle du marché.",
      historicalCards: [
        {
          title: "Monopole initial (2009-2017)",
          body: "Pendant près d'une décennie, le Bitcoin a représenté plus de 80 % du marché. Le premier grand bull-run des altcoins en 2017 a ébranlé cette domination.",
        },
        {
          title: "Cycles de marché (2017-2022)",
          body: "Lors des marchés baissiers, la dominance progresse car les capitaux recherchent la sécurité du BTC ; lors des marchés haussiers, elle diminue lorsque l'appétit pour le risque revient vers les altcoins.",
        },
        {
          title: "Ère institutionnelle (depuis 2020)",
          body: "L'arrivée des institutionnels a introduit de nouveaux flux. Beaucoup privilégient encore le Bitcoin pour sa liquidité et sa clarté réglementaire, influençant la dominance.",
        },
      ],
      tradingTitle: "Intégrer la dominance dans sa stratégie",
      tradingIntro:
        "Associer l'analyse des prix à la dominance permet de repérer quand les capitaux basculent entre Bitcoin et le reste du marché.",
      tradingColumns: [
        [
          {
            title: "Cassures de dominance :",
            body:
              " Les franchissements marqués des tendances de dominance précèdent souvent d'importantes rotations entre BTC et altcoins",
            accent: "emerald",
          },
          {
            title: "Trading des divergences :",
            body:
              " Observer les divergences entre le prix du BTC et la dominance révèle des changements discrets de sentiment",
            accent: "emerald",
          },
          {
            title: "Timing des rotations sectorielles :",
            body:
              " Les mouvements de dominance aident à arbitrer entre Bitcoin, grandes altcoins et actifs plus risqués",
            accent: "emerald",
          },
        ],
        [
          {
            title: "Identifier le cycle :",
            body:
              " Les zones historiques de dominance situent le marché dans son cycle global",
            accent: "blue",
          },
          {
            title: "Rééquilibrage du portefeuille :",
            body:
              " Ajuster la pondération Bitcoin/altcoins selon la dominance contribue à maîtriser le risque",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "Notre suivi en temps réel de la dominance fournit un contexte immédiat pour agir sans attendre.",
      factorsTitle: "Les facteurs qui influencent la dominance",
      factorsIntro:
        "Plusieurs forces peuvent faire varier la part de marché du Bitcoin :",
      factorsColumns: [
        {
          title: "Forces de marché",
          accent: "yellow",
          bullets: [
            "Conditions macroéconomiques",
            "Flux d'investissement institutionnels",
            "Sentiment des investisseurs particuliers",
            "Répartition des volumes de trading",
            "Liquidité disponible sur les plateformes",
          ],
        },
        {
          title: "Progrès technologiques",
          accent: "rose",
          bullets: [
            "Mises à jour du réseau Bitcoin",
            "Solutions de scalabilité de deuxième couche",
            "Innovations sur les blockchains alternatives",
            "Croissance des écosystèmes DeFi et NFT",
            "Évolutions réglementaires",
          ],
        },
      ],
      factorsOutro:
        "Suivre ces paramètres en parallèle de la dominance offre une vision complète des flux de capitaux.",
    },
    zh: {
      understandingTitle: "比特币主导率解析",
      understandingParagraphs: [
        "比特币主导率表示比特币在整个加密市场总市值中的占比。关注这一指标有助于判断资金是更偏好比特币的安全性，还是流向其他资产寻找机会。",
        "主导率上升通常意味着避险情绪增强；主导率下降则表明投资者愿意承担更多风险，把资金投入到其他加密资产中。",
      ],
      highTitle: "主导率走高意味着",
      highBullets: [
        "比特币保持强势地位",
        "山寨币市场份额被压缩",
        "市场可能处于整理阶段",
        "传统金融机构信心提升",
        "机构资金持续涌入",
        "市场整体趋于谨慎",
      ],
      lowTitle: "主导率走低意味着",
      lowBullets: [
        "山寨币行情可能开启",
        "资产配置更加多元化",
        "加密生态逐步成熟",
        "比特币之外的创新加速",
        "加密市场整体扩张",
        "投资者风险偏好上升",
      ],
      historicalTitle: "回顾比特币主导率历史",
      historicalIntro:
        "自山寨币问世以来，比特币主导率呈现出清晰的周期性。了解这些阶段有助于解读当前的市场结构。",
      historicalCards: [
        {
          title: "早期垄断（2009-2017）",
          body: "在最初的几年里，比特币市值占比常年高于80%。直到2017年第一波山寨币牛市到来，这种垄断格局才开始松动。",
        },
        {
          title: "市场周期（2017-2022）",
          body: '熊市期间，资金倾向于回归比特币这一"避风港"，主导率上升；牛市期间，风险偏好增强，资金流向山寨币，主导率随之下降。',
        },
        {
          title: "机构时代（2020年至今）",
          body: "机构资金的涌入带来了新的资金流动。由于流动性和监管更明晰，大型机构仍然偏好比特币，这也影响着主导率的表现。",
        },
      ],
      tradingTitle: "在交易策略中运用主导率",
      tradingIntro:
        "将价格分析与主导率结合，可以洞察资金在比特币与其他资产之间的轮动。",
      tradingColumns: [
        [
          {
            title: "主导率突破：",
            body:
              " 主导率趋势线的显著突破，往往预示着资金在比特币与山寨币之间的大规模迁移",
            accent: "emerald",
          },
          {
            title: "背离交易：",
            body:
              " 观察比特币价格与主导率的背离，有助于提前捕捉市场情绪的变化",
            accent: "emerald",
          },
          {
            title: "板块轮动节奏：",
            body:
              " 主导率走势可以帮助判断在比特币、大市值山寨币与高风险资产之间切换的时机",
            accent: "emerald",
          },
        ],
        [
          {
            title: "识别市场周期：",
            body:
              " 结合历史主导率区间，可以推测当前所处的加密市场周期",
            accent: "blue",
          },
          {
            title: "资产再平衡：",
            body:
              " 根据主导率的高低调整比特币与山寨币的仓位，有助于控制投资组合风险",
            accent: "blue",
          },
        ],
      ],
      tradingOutro:
        "我们的实时主导率看板为交易决策提供及时而可靠的参考。",
      factorsTitle: "影响比特币主导率的因素",
      factorsIntro:
        "以下因素可能推动主导率上升或下降：",
      factorsColumns: [
        {
          title: "市场力量",
          accent: "yellow",
          bullets: [
            "宏观经济环境",
            "机构资金流向",
            "散户投资者情绪",
            "成交量分布格局",
            "交易所间的流动性",
          ],
        },
        {
          title: "技术进展",
          accent: "rose",
          bullets: [
            "比特币网络升级",
            "二层扩容方案",
            "其他区块链的技术创新",
            "DeFi 与 NFT 生态发展",
            "监管政策变化",
          ],
        },
      ],
      factorsOutro:
        "将这些因素与主导率指标一同追踪，可以更全面地理解资金流向。",
    },
  };

  const content = localizedContent[language] ?? localizedContent.en;

  const summaryStyles = (() => {
    const base = "w-full rounded-2xl border p-6 text-center text-foreground shadow-lg transition-colors";

    if (summaryTone === "positive") {
      return {
        container: `${base} border-emerald-500/40 bg-emerald-500/10`,
        label: "text-emerald-100/80",
        value: "text-emerald-50",
        subtext: "text-emerald-100/80",
      };
    }

    if (summaryTone === "negative") {
      return {
        container: `${base} border-rose-500/40 bg-rose-500/10`,
        label: "text-rose-100/80",
        value: "text-rose-50",
        subtext: "text-rose-100/80",
      };
    }

    return {
      container: `${base} border-border/60 bg-background/70`,
      label: "text-muted-foreground/80",
      value: "text-foreground",
      subtext: "text-muted-foreground/80",
    } as const;
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-background via-background/95 to-background">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-16 md:max-w-5xl lg:max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              {content.understandingTitle}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {content.understandingParagraphs[0]}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-10 sm:px-6">
        <div className={summaryStyles.container}>
          {isSummaryLoading ? (
            <div className="space-y-3">
              <Skeleton className="mx-auto h-3 w-24" />
              <Skeleton className="mx-auto h-10 w-32" />
              <Skeleton className="mx-auto h-3 w-28" />
              <Skeleton className="mx-auto h-6 w-24" />
            </div>
          ) : isSummaryError || dominanceValue === null ? (
            <p className="text-sm text-rose-100/80">
              {t("btcDominanceSummaryError")}
            </p>
          ) : (
            <>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${summaryStyles.label}`}
              >
                {t("btcDominanceLabel")}
              </p>
              <p className={`mt-3 text-4xl font-bold ${summaryStyles.value}`}>
                {dominanceDisplay}
              </p>
              <p className={`mt-2 text-sm ${summaryStyles.subtext}`}>
                {t("btcDominanceCurrent")}
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${summaryStyles.subtext}`}
                >
                  {t("btcDominanceChange")}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${changeBadgeClass}`}
                >
                  {changeBadgeLabel}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <BtcDominanceChart />
      </div>

      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/60 bg-card/90 p-6 shadow-xl sm:p-8 lg:p-10">
          <h2 className="mb-6 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
            {content.understandingTitle}
          </h2>
          <div className="space-y-6 text-muted-foreground">
            {content.understandingParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed sm:text-lg">
                {paragraph}
              </p>
            ))}

            <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200/60 bg-emerald-500/10 p-6 sm:p-8 dark:border-emerald-500/30 dark:bg-emerald-500/15">
                <h3 className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">
                  {content.highTitle}
                </h3>
                <ul className="space-y-3 text-sm text-foreground sm:text-base">
                  {content.highBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span className="flex-1 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-blue-200/60 bg-blue-500/10 p-6 sm:p-8 dark:border-blue-500/30 dark:bg-blue-500/15">
                <h3 className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">
                  {content.lowTitle}
                </h3>
                <ul className="space-y-3 text-sm text-foreground sm:text-base">
                  {content.lowBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      <span className="flex-1 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card/90 p-6 shadow-xl sm:p-8 lg:p-10">
          <h2 className="mb-6 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
            {content.historicalTitle}
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-base leading-relaxed sm:text-lg">
              {content.historicalIntro}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {content.historicalCards.map((card, index) => {
                const accentClasses = [
                  "border-purple-200/60 bg-purple-500/10 dark:border-purple-500/30 dark:bg-purple-500/15",
                  "border-orange-200/60 bg-orange-500/10 dark:border-orange-500/30 dark:bg-orange-500/15",
                  "border-indigo-200/60 bg-indigo-500/10 dark:border-indigo-500/30 dark:bg-indigo-500/15",
                ];
                return (
                  <div
                    key={card.title}
                    className={`rounded-xl p-6 sm:p-8 ${accentClasses[index]}`}
                  >
                    <h3 className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground sm:text-base">
                      {card.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card/90 p-6 shadow-xl sm:p-8 lg:p-10">
          <h2 className="mb-6 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
            {content.tradingTitle}
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-base leading-relaxed sm:text-lg">
              {content.tradingIntro}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {content.tradingColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-4 text-foreground">
                  {column.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span
                        className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                          item.accent === "emerald"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="block text-sm leading-relaxed sm:text-base">
                          {item.body}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-6 text-base leading-relaxed sm:text-lg">
              {content.tradingOutro}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card/90 p-6 shadow-xl sm:p-8 lg:p-10">
          <h2 className="mb-6 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
            {content.factorsTitle}
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-base leading-relaxed sm:text-lg">
              {content.factorsIntro}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {content.factorsColumns.map((column) => (
                <div
                  key={column.title}
                  className={`rounded-xl p-6 sm:p-8 ${
                    column.accent === "yellow"
                      ? "border-yellow-200/60 bg-yellow-500/10 dark:border-yellow-500/30 dark:bg-yellow-500/15"
                      : "border-rose-200/60 bg-rose-500/10 dark:border-rose-500/30 dark:bg-rose-500/15"
                  }`}
                >
                  <h3 className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">
                    {column.title}
                  </h3>
                  <ul className="space-y-3 text-sm text-foreground sm:text-base">
                    {column.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                            column.accent === "yellow"
                              ? "bg-yellow-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span className="flex-1 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-6 text-base leading-relaxed sm:text-lg">
              {content.factorsOutro}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

