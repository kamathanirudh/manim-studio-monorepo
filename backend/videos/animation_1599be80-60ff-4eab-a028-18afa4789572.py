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
        self.play(pentagon.animate.scale(2), rate_func=smooth, run_time=3)
        self.wait()