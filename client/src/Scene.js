import React from "react";
import Matter from "matter-js";

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: props.total,
      dropped: 0,
    };
  }

  componentDidMount() {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Common = Matter.Common,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
      world = engine.world;

    // create renderer
    var render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight - 100,
        background: "#6B705C",
        wireframes: false,
      },
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    this.setState({ dropped: this.state.dropped + 40 * 5 });
    var stack = Composites.stack(-400, -200, 40, 5, 0, 0, function (x, y) {
      return Bodies.circle(x, y, Common.random(5, 20), {
        friction: 0.00001,
        restitution: 0.5,
        density: 0.001,
        frictionAir: 0.02,
        speed: 2,
      });
    });

    World.add(world, stack);

    World.add(world, [
      Bodies.rectangle(-100, 150, 600, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(75, 400, 700, 20, {
        isStatic: true,
        angle: -Math.PI * 0.06,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(-650, 400, 300, 20, {
        isStatic: true,
        angle: Math.PI * 0.25,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(600, 580, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.04,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(-300, 700, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.04,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(window.innerHeight + 75, 620, 60, 20, {
        isStatic: true,
        angle: Math.PI * -0.25,
        render: { fillStyle: "#DDBEA9" },
      }),
      //   Left, Right borders
      Bodies.rectangle(window.innerHeight + 100, 585, 500, 20, {
        isStatic: true,
        angle: Math.PI * -0.5,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(-window.innerHeight - 100, 585, 500, 20, {
        isStatic: true,
        angle: Math.PI * -0.5,
        render: { fillStyle: "#DDBEA9" },
      }),
      Bodies.rectangle(
        0,
        window.innerHeight - 100,
        window.outerWidth * 1.3,
        10,
        {
          isStatic: true,
          angle: Math.PI * 0,
          render: { fillStyle: "#00000000" },
        }
      ),
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, Composite.allBodies(world));

    // wrapping using matter-wrap plugin
    for (var i = 0; i < stack.bodies.length; i += 1) {
      stack.bodies[i].plugin.wrap = {
        min: { x: render.bounds.min.x, y: render.bounds.min.y },
        max: { x: render.bounds.max.x, y: render.bounds.max.y },
      };
    }

    Engine.run(engine);

    Render.run(render);

    // Set interval to release new particles
    const dropInterval = setInterval(() => {
      if (this.state.dropped > this.state.total) {
        clearInterval(dropInterval);
      }

      const roll = Math.floor(Math.random() * 3);
      switch (roll) {
        case 0:
          this.setState({ dropped: this.state.dropped + 30 }); // 10oz
          break;
        case 1:
          this.setState({ dropped: this.state.dropped + 30 }); // 10oz
          break;
        default:
          this.setState({ dropped: this.state.dropped + 300 }); // 100oz
          break;
      }

      var stack = Composites.stack(-350, -1000, 1, 3, 0, 0, function (x, y) {
        return Bodies.circle(x, y, Common.random(5, 20), {
          friction: 0.00001,
          restitution: 0.5,
          density: 0.001,
          frictionAir: 0.02,
          speed: 2,
        });
      });

      // wrapping using matter-wrap plugin
      for (var i = 0; i < stack.bodies.length; i += 1) {
        stack.bodies[i].plugin.wrap = {
          min: { x: render.bounds.min.x, y: render.bounds.min.y },
          max: { x: render.bounds.max.x, y: render.bounds.max.y },
        };
      }

      World.add(world, stack);
    }, 100);
  }

  render() {
    return (
      <>
        <p
          style={{
            background: "rgba(0, 0, 0, 0)",
            position: "absolute",
            color: "#d3d3d3",
            fontSize: "5rem",
            lineHeight: 1,
            paddingLeft: "1.5em",
            paddingTop: "1.5em",
          }}
        >
          WSS holds <br />
          {this.state.dropped} oz <br />
          of Silver
        </p>
        <div ref="scene" />
      </>
    );
  }
}
export default Scene;
