-- Filtro do pandoc para as páginas do site: tira a autoria e a nota de IA (o rodapé do site já traz as duas),
-- transforma cada mito em um bloco e recolhe as fontes.
local texto = pandoc.utils.stringify

function Pandoc(doc)
  local out, secao, em_fontes = {}, "", false
  for _, b in ipairs(doc.blocks) do
    local t = texto(b)
    if b.t == "Header" and b.level == 2 then
      secao = t
      if em_fontes then out[#out + 1] = pandoc.RawBlock("html", "</details>"); em_fontes = false end
      if t == "Fontes" then
        em_fontes = true
        out[#out + 1] = pandoc.RawBlock("html", '<details class="fontes"><summary>Fontes</summary>')
        goto continue
      end
    end
    if b.t == "Para" and (t:match("^Projeto de Extensão") or t:match("^Uso de IA")) then goto continue end
    if b.t == "HorizontalRule" then goto continue end
    if b.t == "Para" and secao:match("mitos") and b.content[1] and b.content[1].t == "Strong" then
      local q = b.content[1]
      local resto = pandoc.List(b.content)
      resto:remove(1)
      while resto[1] and (resto[1].t == "Space" or resto[1].t == "SoftBreak") do resto:remove(1) end
      out[#out + 1] = pandoc.Div({ pandoc.Para(q.content), pandoc.Para(resto) }, pandoc.Attr("", { "mito" }))
      out[#out].content[1] = pandoc.Div({ pandoc.Plain(q.content) }, pandoc.Attr("", { "q" }))
      goto continue
    end
    out[#out + 1] = b
    ::continue::
  end
  if em_fontes then out[#out + 1] = pandoc.RawBlock("html", "</details>") end
  return pandoc.Pandoc(out, doc.meta)
end
