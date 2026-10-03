import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.rugcheck.xyz/v1/tokens/${address}/report`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to fetch token data from Rugcheck' }, { status: response.status });
    }

    const data = await response.json();

    const tokenName = data.tokenMeta?.name || 'Unknown Token';
    const tokenSymbol = data.tokenMeta?.symbol || 'UNKNOWN';

    // 1. Check Authorities
    const mintAuthority = data.token?.mintAuthority !== null;
    const freezeAuthority = data.token?.freezeAuthority !== null;

    // 2. Calculate Top 10 Holders Percentage
    let top10HoldersPercent = 0;
    if (data.topHolders && Array.isArray(data.topHolders)) {
      const top10 = data.topHolders.slice(0, 10);
      top10HoldersPercent = top10.reduce((acc: number, holder: any) => acc + (holder.pct || 0), 0);
    }
    top10HoldersPercent = Math.round(top10HoldersPercent * 100) / 100;

    // 3. Liquidity Check
    let liquidityLocked = false;
    if (data.markets && Array.isArray(data.markets)) {
      for (const market of data.markets) {
        if (market.lp && market.lp.lpLockedPct > 50) {
          liquidityLocked = true;
          break;
        }
      }
    }

    // 4. Token-2022 Extension Analysis
    const isToken2022 = data.tokenProgram === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' || data.token_extensions !== null;
    let hasDangerousExtensions = false;
    
    // Check if Rugcheck flagged any malicious taxes or fees in the risks array
    if (data.risks && Array.isArray(data.risks)) {
      for (const risk of data.risks) {
        const riskName = risk.name.toLowerCase();
        if (riskName.includes('fee') || riskName.includes('tax') || riskName.includes('extension') || riskName.includes('transfer')) {
          // Flag as dangerous if it's a high severity risk
          if (risk.level === 'danger' || risk.level === 'warn') {
             hasDangerousExtensions = true;
             break;
          }
        }
      }
    }

    // Determine overall score based on metrics
    const isHighRisk = mintAuthority || freezeAuthority || !liquidityLocked || top10HoldersPercent > 50 || hasDangerousExtensions;
    const overallScore = isHighRisk ? 'Danger' : 'Safe';

    return NextResponse.json({
      tokenName,
      tokenSymbol,
      overallScore,
      metrics: {
        liquidityLocked,
        mintAuthority,
        freezeAuthority,
        top10HoldersPercent,
        isToken2022,
        hasDangerousExtensions
      }
    });

  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
