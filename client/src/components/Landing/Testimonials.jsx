import testimonials from "../../assets/data/testimonials";

const Testimonials = () => {
  return (
    <section className="bg-slate-50 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-slate-900">
          Voices from our Scholars
        </h2>

        <p className="text-center text-slate-600 mt-4">
          Trusted by thousands of students and educators.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.course}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-slate-600 italic leading-relaxed">
                "{item.review}"
              </p>
            </div>
          ))}

        </div>
      </div>

    </section>
  );
};

export default Testimonials;