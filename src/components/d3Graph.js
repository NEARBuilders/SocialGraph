import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3Graph = ({
  data,
  onMouseOutOfItem,
  onMouseOverOfItem,
  onClickOfItem,
}) => {
  const graphRef = useRef(null);
  let simulation = useRef(null); // Use ref to hold the simulation instance

  useEffect(() => {
    if (!data) return;

    // Clean up any existing simulation and SVG content
    if (simulation.current) {
      simulation.current.stop();
      d3.select(graphRef.current).selectAll("*").remove();
    }

    // D3 code starts here
    const width = 650;
    const height = 325;
    let dragIsOn = false;

    const links = data.edges.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    simulation.current = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force(
        "collide",
        d3.forceCollide().radius((d) => Math.sqrt(d.size)),
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    simulation.current
      .force("collide")
      .strength(0.7)
      .radius((d) => Math.sqrt(d.size))
      .iterations(1);

    const svg = d3
      .select(graphRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 1);

    const node = svg.append("g").selectAll("g").data(nodes).enter().append("g");

    node
      .append("image")
      .attr(
        "xlink:href",
        (d) =>
          `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${d.id}`,
      )
      .attr("x", (d) => -Math.sqrt(d.size) - 5)
      .attr("y", (d) => -Math.sqrt(d.size) - 5)
      .attr(
        "clip-path",
        (d) =>
          `circle(${Math.sqrt(d.size) + 5}px at ${Math.sqrt(d.size) + 5} ${Math.sqrt(d.size) + 5})`,
      )
      .attr("width", (d) => 2 * Math.sqrt(d.size) + 10);

    node
      .append("circle")
      .attr("r", (d) => Math.sqrt(d.size) + 5)
      .attr("fill", "none");

    node.append("title").text((d) => d.id);

    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );

    node
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleMouseClick);

    function handleMouseClick(e) {
      const d = e.target.__data__;
      onClickOfItem(d.id);
    }

    function handleMouseOver(d) {
      d = d.target.__data__;
      link.attr("stroke-opacity", (e) =>
        e.source === d || e.target === d ? 1 : 0.1,
      );

      node.attr("opacity", function (n) {
        return n === d || isConnected(d, n) ? 1 : 0.3;
      });
      onMouseOverOfItem(d.id);
    }

    function handleMouseOut() {
      if (dragIsOn) {
        return;
      }
      link.attr("stroke-opacity", 0.6);
      node.attr("opacity", 1);
      onMouseOutOfItem();
    }

    function isConnected(a, b) {
      return links.some(
        (link) =>
          (link.source === a && link.target === b) ||
          (link.source === b && link.target === a),
      );
    }

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event) {
      dragIsOn = true;
      if (!event.active) simulation.current.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.current.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
      dragIsOn = false;
      handleMouseOut();
    }

    // Clean up simulation on unmount
    return () => {
      if (simulation.current) simulation.current.stop();
    };
  }, [data]);

  return (
    <svg
      ref={graphRef}
      id="graph"
      width="100%"
      height="auto"
      viewBox="0 0 650 325"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", margin: "auto" }}
    />
  );
};

export default D3Graph;
