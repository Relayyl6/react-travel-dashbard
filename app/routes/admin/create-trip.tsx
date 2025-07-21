import { Header } from 'components'
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from './+types/create-trip';
import axios from 'axios';

const handleSubmit = async () => {

}

export const loader = async () => {
    const response = await axios.get('https://www.apicountries.com/countries');
    const data = response.data;
    console.log(data);
    if (!Array.isArray(data)) {
      throw new Error("Countries API did not return an array");
    }

    return data.map((country: any) => ({
      flag: `${country.flag}`,
      name: `${country.name}`,
      coordinates: country.latlng as [number, number],
      value: `${country.name}`,
      openStreetMap: `${country.maps?.openStreetMap}`,
    }));
}

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];

  const countryData = countries.map((country) => ({
        flag: country.flag,
        name: country.name,
        value: country.value,
  }))

  return (
    <main className='flex flex-col gap-10 pb-20 wrapper'>
      <Header
        title="Add a New Trip"
        description='View and Edit AI-generated Travel Plans'
      />

      <section className='mt-2.5 wrapper-md'>
        <form className='flex flex-col gap-6 py-6 bg-white border border-light-200 rounded-xl shadow-100' onSubmit={handleSubmit}>
          <div className='w-full flex flex-col gap-2.5 px-6 relative'>
            <label htmlFor='country'>Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: 'name', value: 'value' }}
              placeholder='Select a Country'
              className='!p-3.5 !.border w-full !border-light-400 !-rounded-xl !text-base !text-dark-300 !font-normal'
              itemTemplate={(data: any) => (
                <div className="flex flex-row items-center gap-2">
                  <img src={data.flag} className="!size-6 !rounded-xl !ml-2 !items-center !flex !jutify-center"/>
                  <span>{data.name}</span>
                </div>
              )}
            />
          </div>
        </form>
      </section>
    </main>
  )
}

export default CreateTrip