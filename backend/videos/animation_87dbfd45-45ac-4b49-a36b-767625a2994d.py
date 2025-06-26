from manim import *

class Scene1(Scene):
    def construct(self):
        pentagon = RegularPolygon(n=5, color=BLUE)
        self.play(Create(pentagon))
        self.wait()

class Scene2(Scene):
    def construct(self):
        pentagon = RegularPolygon(n=5, color=BLUE)
        self.play(Create(pentagon))
        self.play(Transform(pentagon, pentagon.scale(2)))
        self.wait()