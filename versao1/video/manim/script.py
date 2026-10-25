"""Animações de apoio ao vídeo "Como funciona o golpe da maquininha quebrada".

Três cenas independentes, uma por trecho do roteiro (2-roteiro-video.md):
  Cena1_Aproximacao  -> [ANIMAÇÃO 1] como o pagamento funciona
  Cena2_Golpe        -> [ANIMAÇÃO 2] os quatro passos do golpe
  Cena3_Protecao     -> [ANIMAÇÃO 3] antes, na hora, depois

Renderizar (a partir de versao1/video):
  uv run manim -ql manim/script.py Cena1_Aproximacao Cena2_Golpe Cena3_Protecao   # rascunho
  uv run manim -qh manim/script.py Cena1_Aproximacao Cena2_Golpe Cena3_Protecao   # entrega
"""
from manim import *

BG = "#1C1C1C"
AZUL = "#58C4DD"
VERDE = "#83C167"
AMARELO = "#FFD93D"
VERMELHO = "#FF6B6B"
CINZA = "#888888"
MONO = "JetBrains Mono"  # se não tiver a fonte, troque por "DejaVu Sans Mono"


def txt(s, size=28, color=WHITE, weight=NORMAL):
    return Text(s, font_size=size, color=color, font=MONO, weight=weight)


def cartao(cor=AZUL, rotulo=""):
    corpo = RoundedRectangle(width=1.8, height=1.15, corner_radius=0.12,
                             color=cor, fill_color=cor, fill_opacity=0.25)
    chip = RoundedRectangle(width=0.35, height=0.27, corner_radius=0.05,
                            color=AMARELO, fill_color=AMARELO, fill_opacity=0.8)
    chip.move_to(corpo.get_left() + RIGHT * 0.45 + UP * 0.12)
    tarja = Line(corpo.get_left() + RIGHT * 0.2 + DOWN * 0.32,
                 corpo.get_right() + LEFT * 0.2 + DOWN * 0.32, color=cor, stroke_width=3)
    grupo = VGroup(corpo, chip, tarja)
    if rotulo:
        grupo.add(txt(rotulo, 16, cor).move_to(corpo.get_center() + RIGHT * 0.3 + UP * 0.12))
    return grupo


def maquininha():
    corpo = RoundedRectangle(width=2.0, height=2.6, corner_radius=0.18,
                             color=CINZA, fill_color=CINZA, fill_opacity=0.15)
    visor = Rectangle(width=1.5, height=0.55, color=VERDE, fill_color=VERDE, fill_opacity=0.15)
    visor.move_to(corpo.get_top() + DOWN * 0.7)
    teclas = VGroup(*[Square(0.22, color=CINZA, stroke_width=2) for _ in range(9)])
    teclas.arrange_in_grid(3, 3, buff=0.12).move_to(corpo.get_bottom() + UP * 0.8)
    return VGroup(corpo, visor, teclas)


class Cena1_Aproximacao(Scene):
    """Cartão encosta na maquininha, cada compra gera um código novo, limite sem senha."""

    def construct(self):
        self.camera.background_color = BG
        maq = maquininha().move_to(RIGHT * 2.2 + DOWN * 0.2)
        card = cartao(AZUL).move_to(LEFT * 3.2 + DOWN * 0.2)
        titulo = txt("Como a aproximação funciona", 36, AZUL, BOLD).to_edge(UP, buff=0.5)

        self.add_subcaption("Como o pagamento por aproximação funciona", duration=2)
        self.play(Write(titulo), FadeIn(maq), FadeIn(card), run_time=1.5)
        self.wait(0.5)

        # NFC: alcance de poucos centímetros
        self.play(card.animate.next_to(maq, LEFT, buff=0.35), run_time=1.5)
        ondas = VGroup(*[Arc(radius=0.35 * (i + 1), start_angle=-PI / 4, angle=PI / 2,
                             color=AZUL, stroke_width=4, stroke_opacity=1 - i * 0.25)
                         for i in range(3)])
        ondas.move_to(card.get_right(), aligned_edge=LEFT)
        self.play(LaggedStart(*[Create(o) for o in ondas], lag_ratio=0.3), run_time=1.2)
        nfc = txt("NFC: só funciona a poucos centímetros", 24, AZUL).to_edge(DOWN, buff=0.7)
        self.play(FadeIn(nfc), run_time=0.8)
        self.wait(1.5)

        # código único a cada compra
        self.play(FadeOut(ondas), FadeOut(nfc), run_time=0.5)
        cab = txt("Cada compra gera um código diferente", 24, VERDE).to_edge(DOWN, buff=1.3)
        self.play(FadeIn(cab), run_time=0.8)
        codigos = ["A7F3-91C2", "5B80-4E1D", "C29A-07F6"]
        atual = None
        for i, c in enumerate(codigos):
            novo = txt(f"compra {i + 1}: {c}", 22, AMARELO).to_edge(DOWN, buff=0.6)
            self.play(FadeIn(novo, shift=UP * 0.2) if atual is None
                      else ReplacementTransform(atual, novo), run_time=0.8)
            atual = novo
            self.wait(0.8)
        self.play(FadeOut(atual), FadeOut(cab), run_time=0.5)

        # limite sem senha
        barra = RoundedRectangle(width=6, height=0.5, corner_radius=0.1, color=VERMELHO,
                                 fill_color=VERMELHO, fill_opacity=0.3).to_edge(DOWN, buff=1.0)
        legenda = txt("até R$ 200 por compra: sem senha*", 26, VERMELHO, BOLD).next_to(barra, UP, buff=0.2)
        nota = txt("*o valor depende de cada emissor e pode ser diferente", 18, CINZA).to_edge(DOWN, buff=0.4)
        self.add_subcaption("Até R$ 200 por compra passam sem senha (o valor varia por emissor)", duration=3)
        self.play(FadeIn(legenda), GrowFromEdge(barra, LEFT), run_time=1.5)
        self.play(FadeIn(nota), run_time=0.6)
        self.wait(2.5)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)


class Cena2_Golpe(Scene):
    """Os quatro passos do golpe da maquininha 'quebrada'."""

    def construct(self):
        self.camera.background_color = BG
        titulo = txt("O golpe da maquininha \"quebrada\"", 34, VERMELHO, BOLD).to_edge(UP, buff=0.5)
        self.add_subcaption("O golpe da maquininha quebrada", duration=2)
        self.play(Write(titulo), run_time=1.5)

        passos = [
            ("1", "\"A aproximação\nestá fora do ar\"", AMARELO),
            ("2", "Você insere o cartão\ne digita a senha", AZUL),
            ("3", "Ele olha o teclado e\nvira de costas com o cartão", VERMELHO),
            ("4", "Devolve um cartão\nparecido: a troca", VERMELHO),
        ]
        colunas = VGroup()
        for num, texto, cor in passos:
            circulo = Circle(radius=0.38, color=cor, fill_color=cor, fill_opacity=0.25)
            n = txt(num, 30, cor, BOLD).move_to(circulo)
            leg = txt(texto, 20, WHITE).next_to(circulo, DOWN, buff=0.35)
            colunas.add(VGroup(circulo, n, leg))
        colunas.arrange(RIGHT, buff=0.7, aligned_edge=UP).shift(UP * 0.4)
        colunas.scale_to_fit_width(min(colunas.width, config.frame_width - 1.0))
        colunas.move_to(ORIGIN + UP * 0.6)

        for i, col in enumerate(colunas):
            self.add_subcaption(passos[i][1].replace("\n", " "), duration=2)
            self.play(FadeIn(col, shift=UP * 0.3), run_time=1.0)
            self.wait(0.8)

        # a troca: dois cartões trocam de lugar
        real = cartao(AZUL, "SEU").scale(0.8)
        falso = cartao(VERMELHO, "FALSO").scale(0.8)
        real.move_to(DOWN * 1.5 + LEFT * 2.2)
        falso.move_to(DOWN * 1.5 + RIGHT * 2.2)
        voce = txt("VOCÊ", 18, AZUL).next_to(real, DOWN, buff=0.15)
        golp = txt("GOLPISTA", 18, VERMELHO).next_to(falso, DOWN, buff=0.15)
        self.play(FadeIn(real), FadeIn(falso), FadeIn(voce), FadeIn(golp), run_time=0.8)
        self.play(Swap(real, falso), run_time=1.5, path_arc=PI / 3)
        self.wait(0.5)
        resultado = txt("Ele fica com o cartão verdadeiro E a senha:\nnão fica preso ao limite sem senha e pode sacar",
                        22, VERMELHO, BOLD).to_edge(DOWN, buff=0.4)
        self.add_subcaption("Com cartão e senha, ele não fica preso ao limite", duration=3)
        self.play(FadeIn(resultado, shift=UP * 0.2), run_time=1.0)
        self.wait(3.0)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)


class Cena3_Protecao(Scene):
    """Antes, na hora e depois: três momentos de cuidado."""

    def construct(self):
        self.camera.background_color = BG
        titulo = txt("Como se proteger", 36, VERDE, BOLD).to_edge(UP, buff=0.5)
        self.add_subcaption("Como se proteger", duration=2)
        self.play(Write(titulo), run_time=1.2)

        eixo = Line(LEFT * 6.2, RIGHT * 6.2, color=CINZA).shift(UP * 1.4)
        self.play(Create(eixo), run_time=0.8)

        momentos = [
            ("ANTES", AZUL, ["Ative as notificações", "Lugar cheio? Desative a\naproximação ou use a\ncarteira digital"]),
            ("NA HORA", AMARELO, ["Confira o valor no visor", "O cartão não sai da sua vista", "\"Fora do ar\"? Desconfie e\npague de outra forma"]),
            ("DEPOIS", VERDE, ["Confira o cartão devolvido", "Leia a notificação", "Algo estranho? Bloqueie\ne ligue para o banco"]),
        ]
        xs = [-4.2, 0, 4.2]
        for (nome, cor, itens), x in zip(momentos, xs):
            ponto = Dot(eixo.point_from_proportion((x + 6.2) / 12.4), color=cor, radius=0.14)
            rotulo = txt(nome, 28, cor, BOLD).next_to(ponto, UP, buff=0.3)
            self.add_subcaption(nome.capitalize(), duration=2)
            self.play(FadeIn(ponto, scale=2), Write(rotulo), run_time=1.0)
            linhas = VGroup(*[txt("• " + t, 16, WHITE) for t in itens])
            linhas.arrange(DOWN, aligned_edge=LEFT, buff=0.25).next_to(ponto, DOWN, buff=0.6)
            linhas.set_x(x)
            for linha in linhas:
                self.play(FadeIn(linha, shift=RIGHT * 0.2), run_time=0.6)
                self.wait(0.4)
            self.wait(0.6)

        final = txt("Olhe o visor. Leia a notificação.", 28, AMARELO, BOLD).to_edge(DOWN, buff=0.5)
        self.add_subcaption("Olhe o visor e leia a notificação", duration=3)
        self.play(FadeIn(final, shift=UP * 0.2), run_time=1.0)
        self.wait(3.0)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)
