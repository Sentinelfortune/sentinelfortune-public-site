<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />
<xsl:template match="/">
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Updates &amp; Articles | Sentinel Fortune LLC</title><style>
body{margin:0;background:#090e1b;color:#f4f3f0;font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:850px;padding:36px 22px 80px;margin:auto}
a{color:#e6c377}h1{font-size:clamp(30px,5vw,48px);line-height:1.2}p{color:#bbc3d0}
article{padding:20px 0;border-top:1px solid #30394c}article h2{font-size:22px;margin:3px 0 8px}
small{color:#c8af80}.nav{display:flex;gap:20px;flex-wrap:wrap;margin:0 0 45px}
</style></head><body><main>
<nav class="nav"><a href="https://public.sentinelfortune.com/">Public Home</a><a href="https://public.sentinelfortune.com/articles/">Articles</a><a href="https://sentinelfortune.com/">Company</a></nav>
<h1>Sentinel Fortune Updates &amp; Articles</h1>
<p>This is our Atom subscription feed. You can browse the latest publications below or add this address to an RSS/Atom reader for updates.</p>
<xsl:for-each select="a:feed/a:entry">
<article><small><xsl:value-of select="a:published"/></small>
<h2><a><xsl:attribute name="href"><xsl:value-of select="a:link/@href"/></xsl:attribute><xsl:value-of select="a:title"/></a></h2>
<p><xsl:value-of select="a:summary"/></p></article>
</xsl:for-each>
</main></body></html>
</xsl:template></xsl:stylesheet>