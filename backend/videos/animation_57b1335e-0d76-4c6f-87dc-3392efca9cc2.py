from manim import *
class Scene1(Scene):
    def construct(self):
        circle = Circle(color=BLUE)
        self.play(Create(circle), run_time=2)
        self.wait()
class Scene2(Scene):
    def construct(self):
        circle = Circle(color=BLUE)
        triangle = Polygon(np.array([-0.5, -0.5, 0]), np.array([0.5, -0.5, 0]), np.array([0, 0.5, 0]), color=RED)
        self.play(Create(circle), run_time=2)
        self.play(Create(triangle), run_time=2)
        self.wait()