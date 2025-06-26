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
        self.play(pentagon.animate.scale(2), run_time=3)
        self.wait()

class Scene3(Scene):
    def construct(self):
        outer_pentagon = RegularPolygon(n=5, color=BLUE).scale(2)
        inner_pentagon = RegularPolygon(n=5, color=RED)
        self.play(Create(outer_pentagon))
        self.play(Create(inner_pentagon))
        self.wait()

class Scene4(Scene):
    def construct(self):
        outer_pentagon = RegularPolygon(n=5, color=BLUE).scale(2)
        inner_pentagon = RegularPolygon(n=5, color=RED)
        self.play(Create(outer_pentagon))
        self.play(Create(inner_pentagon))
        self.play(inner_pentagon.animate.scale(1.5), run_time=2)
        self.wait()

class Scene5(Scene):
    def construct(self):
        outer_pentagon = RegularPolygon(n=5, color=BLUE).scale(2)
        inner_pentagon = RegularPolygon(n=5, color=RED).scale(1.5)
        circle = Circle(color=YELLOW).scale(0.5)
        self.play(Create(outer_pentagon))
        self.play(Create(inner_pentagon))
        self.play(Create(circle))
        self.wait()

class Scene6(Scene):
    def construct(self):
        outer_pentagon = RegularPolygon(n=5, color=BLUE).scale(2)
        inner_pentagon = RegularPolygon(n=5, color=RED).scale(1.5)
        circle = Circle(color=YELLOW).scale(0.5)
        triangle = Triangle(color=GREEN).scale(0.2)
        self.play(Create(outer_pentagon))
        self.play(Create(inner_pentagon))
        self.play(Create(circle))
        self.play(Create(triangle))
        self.wait()